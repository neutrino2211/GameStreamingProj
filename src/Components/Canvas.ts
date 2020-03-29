import { StatelessWidget } from "widgetsjs";

export class Canvas extends StatelessWidget {
    constructor(){
        super({
            resolution: '720:480'
        }, {
            resolution: s=>{
                console.log(s);
                if(s.indexOf(':') > -1){
                    return s.split(':');
                } else {
                    return [720, 480]
                }
            }
        });
    }

    onMount(){
        const canvas = this.$child<HTMLCanvasElement>('canvas');

        const ctx = canvas.getContext('2d');

        // Draw shit!!

        ctx.beginPath();
        ctx.rect(0, 0, 720, 480);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(100, 100, 100, 100);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(120, 120, 100, 100);
        ctx.fillStyle = 'green';
        ctx.fill();
    }

    render(state: {resolution: Array<Number>}): string {
        return `
            <canvas width=${state.resolution[0]} height=${state.resolution[1]}>
            </canvas>
        `;
    }
}