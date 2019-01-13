export class ColorChanger {
    constructor(defaultRGB, targetElement) {
        this.red = defaultRGB[0];
        this.green = defaultRGB[1];
        this.blue = defaultRGB[2];
        this.targetElement = targetElement;
    }

    setTimeColorToTarget() {
        let time = new Date().getHours();
        let hoursFromMidday = 0;
        if (time > 12) {
            hoursFromMidday = time - 12;
        }
        else if (time < 12) {
            hoursFromMidday = 12 - time;
        }
        let divider = 1 + hoursFromMidday / 3;
        this.targetElement.style.backgroundColor = 'rgb(' + this.red / divider + ',' + this.green / divider + ',' + this.blue / divider + ')';
    }
}