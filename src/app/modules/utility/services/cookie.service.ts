import { ICookie } from './../models/ICookie';

export class CookieService {
    public static setCookie(cookie: ICookie) {
        document.cookie = `${cookie.name}=${cookie.value}`;
    }

    public static getCookie(name: string): ICookie {
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        let cookie: ICookie = null;
        ca.forEach(c => {
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                cookie = {
                    name,
                    value: c.substring(name.length + 1)
                };
            }
        });

        return cookie;
    }

    public static removeCookie(name: string) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
