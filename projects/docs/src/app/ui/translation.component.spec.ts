import { render, RenderResult } from '@meeui/adk/test';
import { provideTranslate } from '@meeui/adk/translate';
import TranslationComponent from './translation.component';

describe('TranslationComponent', () => {
  let view: RenderResult<TranslationComponent>;

  beforeEach(async () => {
    view = await render(TranslationComponent, [
      provideTranslate({ defaultLang: 'en', preloadedLanguages: { en: { name: 'Hello' } } }),
    ]);
  });

  it('should create', async () => {
    expect(view.host).toBeTruthy();
  });
});
