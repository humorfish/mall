export function sortLinear(data: any, property: any, direction = 'asc')
{
    return data.sort((a: any, b: any) => {
        if (direction === 'asc')
        {
            return a[property] - b[property];
        }
        else
        {
            return b[property] - a[property];
        }
    });
}

export function sortByDomain(data: any, property: any, direction = 'asc', domain: any)
{
    return data.sort((a: any, b: any) => {
        const aVal = a[property];
        const bVal = b[property];

        const aIdx = domain.indexOf(aVal);
        const bIdx = domain.indexOf(bVal);

        if (direction === 'asc')
        {
            return aIdx - bIdx;
        }
        else
        {
            return bIdx - aIdx;
        }
    });
}

export function sortByTime(data: any, property: any, direction = 'asc') {
    return data.sort((a: any, b: any) => {
        const aDate = a[property].getTime();
        const bDate = b[property].getTime();

        if (direction === 'asc')
        {
            if (aDate > bDate) return 1;
            if (bDate > aDate) return -1;
            return 0;
        }
        else
        {
        if (aDate > bDate)
            return -1;

        if (bDate > aDate)
            return 1;

        return 0;
        }
    });
}
