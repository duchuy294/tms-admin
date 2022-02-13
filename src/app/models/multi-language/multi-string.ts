export class MultiLanguageString {
    vi = '';
    en = '';

    public getString(lang: string): string {
        if (lang === 'en') {
            return this.en;
        }
        return this.vi;
    }
}
