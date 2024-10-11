import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';

export function isServer() {
  return isPlatformServer(inject(PLATFORM_ID));
}

export function isClient() {
  return isPlatformBrowser(inject(PLATFORM_ID));
}
