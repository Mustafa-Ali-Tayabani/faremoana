import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SeoService } from './seo.service';

/** Replaces the router's title handling: every navigation refreshes all page metadata. */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.seo.update(snapshot.url);
  }
}
