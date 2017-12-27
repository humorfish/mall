declare global
{
    var Defaults: DefaultDatas | undefined;
    interface Window
    {
        Defaults: DefaultDatas | undefined;
    }
}

export class DefaultDatas
{
    constructor()
    {
    }

    responsive: boolean = true;
    responsiveAnimationDuration: number = 0;
    maintainAspectRatio: boolean = true;
    events: Array<string> = ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'];
    hover: any = {
        onHover: null,
        mode: 'nearest',
        intersect: true,
        animationDuration: 400
    };
    onClick: any = null;
    defaultColor: string = 'rgba(0,0,0,0.1)';
    defaultFontColor: string = '#666';
    defaultFontFamily: string = '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif';
    defaultFontSize: number = 12;
    defaultFontStyle: string = 'normal';
    showLines: boolean = true;

    // Element defaults defined in element extensions
    elements: any = {
        line: {
            tension: 0.4,
            backgroundColor: this.defaultColor,
            borderWidth: 3,
            borderColor: this.defaultColor,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            capBezierPoints: true,
            fill: true, // do we fill in the area between the line and its base axis
        }
    };

    // Layout options such as padding
    layout: any = {
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    };

    line: any = {
        showLines: true,
        spanGaps: false,

        hover: {
            mode: 'label'
        },

        scales: {
            xAxes: [{
                type: 'category',
                id: 'x-axis-0'
            }],
            yAxes: [{
                type: 'linear',
                id: 'y-axis-0'
            }]
        }
    };
}

