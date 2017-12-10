/**
 * Tools
 */

export class Utils
{
    constructor()
    {
    }

    static IsEmpty(value: any): boolean
    {
        return (value === undefined || value === null || (typeof value === 'string' && value.length === 0));
    }

    static IsArray(value: number): boolean
    {
        return Array.isArray(value);
    }

    static IsObject(value: number): boolean
    {
        return typeof value === 'object' && !Utils.IsArray(value);    
    }

    static replaceUrl(url: string)
    {
        if (-1 !== url.indexOf('http://'))
        {
            return 'http://' + url.substring(7).replace(/\/\//g, '/');
        }
        else if (-1 !== url.indexOf('https://'))
        {
            return 'https://' + url.substring(8).replace(/\/\//g, '/');
        }
        else
            return url;
    }

    /**
     * Format date
     */

    static DateFormate(date: Date, format: string = 'yyyy-MM-dd'): string
    {
        let Time = {
            Year: 0,
            TYear: '0',
            Month: 0,
            TMonth: '0',
            Day: 0,
            TDay: '0',
            Hour: 0,
            THour: '0',
            hour: 0,
            Thour: '0',
            Minute: 0,
            TMinute: '0',
            Second: 0,
            TSecond: '0',
            Millisecond: 0
        };

        Time.Year = date.getFullYear();
        Time.TYear = String(Time.Year).substr(2);
        Time.Month = date.getMonth() + 1;
        Time.TMonth = Time.Month < 10 ? "0" + Time.Month : String(Time.Month);
        Time.Day = date.getDate();
        Time.TDay = Time.Day < 10 ? "0" + Time.Day : String(Time.Day);
        Time.Hour = date.getHours();
        Time.THour = Time.Hour < 10 ? "0" + Time.Hour : String(Time.Hour);
        Time.hour = Time.Hour < 13 ? Time.Hour : Time.Hour - 12;
        Time.Thour = Time.hour < 10 ? "0" + Time.hour : String(Time.hour);
        Time.Minute = date.getMinutes();
        Time.TMinute = Time.Minute < 10 ? "0" + Time.Minute : String(Time.Minute);
        Time.Second = date.getSeconds();
        Time.TSecond = Time.Second < 10 ? "0" + Time.Second : String(Time.Second);
        Time.Millisecond = date.getMilliseconds();

        return format.replace(/yyyy/ig, String(Time.Year))
        .replace(/yyy/ig, String(Time.Year))
        .replace(/yy/ig, Time.TYear)
        .replace(/y/ig, Time.TYear)
        .replace(/MM/g, Time.TMonth)
        .replace(/M/g, String(Time.Month))
        .replace(/dd/ig, Time.TDay)
        .replace(/d/ig, String(Time.Day))
        .replace(/HH/g, Time.THour)
        .replace(/H/g, String(Time.Hour))
        .replace(/hh/g, Time.Thour)
        .replace(/h/g, String(Time.hour))
        .replace(/mm/g, Time.TMinute)
        .replace(/m/g, String(Time.Minute))
        .replace(/ss/ig, Time.TSecond)
        .replace(/s/ig, String(Time.Second))
        .replace(/fff/ig, String(Time.Millisecond))
    }
}