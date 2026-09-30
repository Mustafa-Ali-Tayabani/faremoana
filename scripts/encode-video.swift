// Re-encodes a video for the web with Apple's AVFoundation (no ffmpeg needed):
// H.264, fitted inside --max (default 960px on the long side), --bitrate (default 1.2 Mbit/s),
// audio removed (the site plays it muted), fast-start MP4. Also writes a JPEG poster frame.
//
// Usage: swift scripts/encode-video.swift <input> <output.mp4> [--max 960] [--bitrate 1200000] [--poster out.jpg]

import AVFoundation
import CoreImage
import Foundation

var args = Array(CommandLine.arguments.dropFirst())
func option(_ name: String) -> String? {
    guard let i = args.firstIndex(of: name), i + 1 < args.count else { return nil }
    let value = args[i + 1]
    args.removeSubrange(i...(i + 1))
    return value
}
let maxEdge = Double(option("--max") ?? "960")!
let bitrate = Int(option("--bitrate") ?? "1200000")!
let posterPath = option("--poster")
guard args.count == 2 else {
    FileHandle.standardError.write("usage: encode-video.swift <input> <output.mp4> [--max N] [--bitrate N] [--poster file.jpg]\n".data(using: .utf8)!)
    exit(64)
}
let input = URL(fileURLWithPath: args[0])
let output = URL(fileURLWithPath: args[1])
try? FileManager.default.removeItem(at: output)

let asset = AVURLAsset(url: input)
let semaphore = DispatchSemaphore(value: 0)
var failure: Error?

Task {
    do {
        guard let track = try await asset.loadTracks(withMediaType: .video).first else {
            throw NSError(domain: "encode", code: 1, userInfo: [NSLocalizedDescriptionKey: "no video track"])
        }
        let (naturalSize, transform, fps) = try await track.load(.naturalSize, .preferredTransform, .nominalFrameRate)
        // Display size after rotation (iPhone portrait videos are stored landscape + rotation).
        let shown = naturalSize.applying(transform)
        let (w0, h0) = (abs(shown.width), abs(shown.height))
        let scale = min(1, maxEdge / Double(max(w0, h0)))
        let width = Int((Double(w0) * scale / 2).rounded()) * 2
        let height = Int((Double(h0) * scale / 2).rounded()) * 2

        // Reader decodes and applies rotation + scaling via a video composition.
        let reader = try AVAssetReader(asset: asset)
        let composition = AVMutableVideoComposition()
        composition.renderSize = CGSize(width: width, height: height)
        composition.frameDuration = CMTime(value: 1, timescale: CMTimeScale(fps > 0 ? min(fps, 30) : 30))
        let instruction = AVMutableVideoCompositionInstruction()
        instruction.timeRange = CMTimeRange(start: .zero, duration: try await asset.load(.duration))
        let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
        let fit = CGAffineTransform(scaleX: CGFloat(scale), y: CGFloat(scale))
        layer.setTransform(transform.concatenating(fit), at: .zero)
        instruction.layerInstructions = [layer]
        composition.instructions = [instruction]

        let readerOutput = AVAssetReaderVideoCompositionOutput(
            videoTracks: [track],
            videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
        readerOutput.videoComposition = composition
        reader.add(readerOutput)

        let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
        writer.shouldOptimizeForNetworkUse = true
        let writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: [
            AVVideoCodecKey: AVVideoCodecType.h264,
            AVVideoWidthKey: width,
            AVVideoHeightKey: height,
            AVVideoCompressionPropertiesKey: [
                AVVideoAverageBitRateKey: bitrate,
                AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
                AVVideoMaxKeyFrameIntervalKey: 60,
            ],
        ])
        writerInput.expectsMediaDataInRealTime = false
        writer.add(writerInput)

        reader.startReading()
        writer.startWriting()
        writer.startSession(atSourceTime: .zero)

        var posterWritten = posterPath == nil
        let queue = DispatchQueue(label: "encode")
        await withCheckedContinuation { (done: CheckedContinuation<Void, Never>) in
            writerInput.requestMediaDataWhenReady(on: queue) {
                while writerInput.isReadyForMoreMediaData {
                    guard let sample = readerOutput.copyNextSampleBuffer() else {
                        writerInput.markAsFinished()
                        done.resume()
                        return
                    }
                    if !posterWritten, let buffer = CMSampleBufferGetImageBuffer(sample),
                       CMSampleBufferGetPresentationTimeStamp(sample).seconds >= 1.0 {
                        let image = CIImage(cvPixelBuffer: buffer)
                        try? CIContext().writeJPEGRepresentation(
                            of: image, to: URL(fileURLWithPath: posterPath!),
                            colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!,
                            options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.8])
                        posterWritten = true
                    }
                    writerInput.append(sample)
                }
            }
        }
        await writer.finishWriting()
        if let error = writer.error ?? reader.error { throw error }
        print("wrote \(output.path) \(width)x\(height)")
    } catch {
        failure = error
    }
    semaphore.signal()
}
semaphore.wait()
if let failure { FileHandle.standardError.write("error: \(failure)\n".data(using: .utf8)!); exit(1) }
