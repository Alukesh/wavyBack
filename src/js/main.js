window.addEventListener('load', () => {
    // mouse position
    let mouse = {
        x: undefined,
        y: undefined,
        radius: 200,
    };
    const mouseMove = (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    };


//////Background Clouds Effects
    const canvasCloud = document.getElementById('canvasCloud');
    const ctxC1 = canvasCloud.getContext('2d');
    ctxC1.canvas.width = window.innerWidth;
    ctxC1.canvas.height = window.innerHeight - 200;
    let cloudRaf, cloudOn = false;

    let particleArray = [];
    const colours = [
        // 'white',
        // 'rgba(255,255,255,0.3)',
        // 'rgba(173,216,230,0.8)',
        'red',
        // 'rgba(211,211,211,0.8)',
        // 'black'
    ];
    const maxSize = 40;
    const minSize = 0;
    const mouseRadius = 60;

    // // mouse position
    // let mouse = {
    //   x: undefined,
    //   y: undefined,
    // };
    // const mouseMove = (event) => {
    //     mouse.x = event.x;
    //     mouse.y = event.y;
    // };

    canvasCloud.addEventListener('mouseover', () =>{
        window.addEventListener('mousemove', mouseMove);
    });
    canvasCloud.addEventListener('mouseout', () => {
       window.removeEventListener('mousemove', mouseMove);
        mouse.x = undefined;
        mouse.y = undefined;
    });

    function Clouds(x, y, directionX, directionY, size, colour) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.colour = colour;
    }
    // add draw method to clouds prototype
    Clouds.prototype.draw = function () {
        ctxC1.beginPath();
        ctxC1.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
        // ctxC1.fillRect(this.x, this.y, this.size, this.size);
        // ctxC1.fillStyle = 'black';
        ctxC1.fillStyle = this.colour;
        ctxC1.strokeStyle = 'red';
        ctxC1.fill();
        ctxC1.stroke();
    };
    Clouds.prototype.update = function () {
      if (this.x + this.size * 2 > canvasCloud.width ||
          this.x - this.size * 2 < 0 ) {
            this.directionX = -this.directionX
        }
      if (this.y + this.size * 2 > canvasCloud.height ||
          this.y - this.size * 2 < 0 ) {
            this.directionY = -this.directionY
        }
      this.x += this.directionX;
      this.y += this.directionY;

      // mouse interactivity
        if (mouse.x - this.x < mouseRadius &&
            mouse.x - this.x > -mouseRadius &&
            mouse.y - this.y < mouseRadius &&
            mouse.y - this.y > -mouseRadius) {
            if (this.size < maxSize) {
                this.size += 5;
            }
        }
        else if (this.size > minSize){
            this.size -= 0.1;
        }
        if (this.size < 0) {
            this.size = 0;
        }
        this.draw()
    };
    // create clouds array
    function initCloud() {
        particleArray = [];
        for (let i = 0; i < 1000; i++){
            let size = 0;
            let x = (Math.random() * ((innerWidth - size *2) - (size *2)) + size *2 );
            let y = (Math.random() * ((innerHeight - size *2) - (size *2)) + size *2 );
            let directionX = (Math.random() * 0.2) - .1;
            let directionY = (Math.random() * 0.2) - .1;
            let color = colours[Math.floor(Math.random() * colours.length)]

            particleArray.push(new Clouds(x, y, directionX, directionY, size, color))
        }
    }

    function animateClouds() { // ОПТИМИЗАЦИЯ
        // if (cloudOn){
            cloudRaf = requestAnimationFrame(animateClouds);
            ctxC1.clearRect(0,0,innerWidth, innerHeight);
            for (let i = 0; i < particleArray.length; i++){
                particleArray[i].update();
            }
        // }

    }
    initCloud();
    animateClouds();
    // canvasCloud.addEventListener("mouseover", () => {
    //     cloudRaf = window.requestAnimationFrame(animateClouds);
    //     cloudOn = true;
    // });
    // canvasCloud.addEventListener("mouseout", () => {
    //     window.cancelAnimationFrame(cloudRaf);
    //     cloudOn = false;
    // });

    window.addEventListener('resize', () => {
       canvasCloud.width = window.innerWidth;
       canvasCloud.height = window.innerHeight;
       initCloud()
    });




///////// Text morph Animation
    const canvasText = document.getElementById('canvasText');
    const ctxC2 = canvasText.getContext('2d');
    ctxC2.canvas.width = window.innerWidth ;
    ctxC2.canvas.height = window.innerHeight ;
    let adjustX = -10;
    let adjustY = -10;
    let TextRaf, TextOn = false;

    let particleText = [];

    ctxC2.fillStyle = 'white';
    ctxC2.font = '30px Verdana'; //Verdana Silkscreen
    ctxC2.fillText('EyesCorp', 20,60,canvasText.width);
    // ctxC2.strokeStyle = 'white';
    // ctxC2.strokeRect(0,0,100,100);
    const textCoordinates = ctxC2.getImageData(0,0,200,100);

    canvasText.addEventListener('mouseover', () =>{
        window.addEventListener('mousemove', mouseMove);
    });
    canvasText.addEventListener('mouseout', () => {
        window.removeEventListener('mousemove', mouseMove);
        mouse.x = undefined;
        mouse.y = undefined;
    });
    class TextParts {
        constructor(x,y, size) {
            this.x = x;
            this.y = y;
            this.baseX = Math.floor(x);
            this.baseY = Math.floor(y);
            this.size =  1;
            this.density = (Math.random() * 30) + 1; // moving speed
        }
        draw(){
            ctxC2.fillStyle = 'white';
            ctxC2.beginPath();
            ctxC2.arc(this.x,this.y,this.size, 0,Math.PI * 2);
            ctxC2.closePath();
            ctxC2.fill();
        }
        update(){
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            if (distance < mouse.radius){
                // this.size = 5;
                ctxC2.fillStyle = 'black'
                this.x -= directionX;
                this.y -= directionY;
            } else {
                this.size = 2;
                if (this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/10;
                }
                if (this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/10;
                }
            }
        }
    }


    function initText() {
        particleText = [];
        for (let y = 0, y2 = textCoordinates.height; y < y2 ; y++){
            for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
                if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                    let  positionX = x + adjustX;
                    let  positionY = y + adjustY;
                    particleText.push(new TextParts(positionX * 10,positionY * 10));
                }
            }
        }
    }
    initText();


    function animateText() {
        if (TextOn){
            ctxC2.clearRect(0,0,canvasText.width,canvasText.height);
            for (let i = 0; i < particleText.length; i++){
                particleText[i].draw();
                particleText[i].update();
            }
            connectText();
            TextRaf = requestAnimationFrame(animateText);
        }

    }
    animateText();
    let stopTextAnimate;
    canvasText.addEventListener("mouseout", () => {
        stopTextAnimate = setTimeout(() => {
            TextRaf = window.cancelAnimationFrame(TextRaf);
            TextOn = false;
        }, 1250);
    });
    canvasText.addEventListener("mouseover", () => {
        TextRaf = window.requestAnimationFrame(animateText);
        TextOn = true;
        clearTimeout(stopTextAnimate)
    });

    function connectText() {
        let opacityValue = 1;
        for (let a = 0; a < particleText.length; a++){
            for (let b = a; b < particleText.length; b++){
                let dx = particleText[a].x - particleText[b].x;
                let dy = particleText[a].y - particleText[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 10){
                    // opacityValue = 0.1;
                    opacityValue = 1 - (distance/23);
                    ctxC2.strokeStyle = 'rgba(155,255,255,' + opacityValue + ')';
                    ctxC2.lineWidth = 1;
                    ctxC2.beginPath();
                    ctxC2.moveTo(particleText[a].x, particleText[a].y);
                    ctxC2.lineTo(particleText[b].x, particleText[b].y);
                    ctxC2.stroke();
                }
            }
        }
    }









/////////Image Wavy Particles Effect
   const canvas = document.getElementById('canvas1');
   const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth -20;
    canvas.height = window.innerHeight;
    let raf, running ;



    class Particles {
        constructor(effect, x, y, color, size) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = 0;// Math.random() * this.effect.height;
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.size = size || 3;
            this.color = color;
            this.vx = 0;//Math.random() * 2 - 1
            this.vy = 0;//Math.random() * 2 - 1
            this.ease = 0.2;
            this.friction =0.95;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
        }
        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size)
        }
        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy; // TO CHANGE POINTING ANIMATION CHANGE * TO + OR -
            this.force = -this.effect.mouse.radius / this.distance;
            //part moving from mouse angle
            if (this.distance < this.effect.mouse.radius){
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
        warp(){
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.ease = 0.02;
        }
    }


    class Effect {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image = document.getElementById('image1');
            this.centerX = this.width / 2;
            this.centerY = this.height / 2;
            this.x = this.centerX - this.image.width * .5;
            this.y = this.centerY - this.image.height * .5;
            this.gap = 3;
            this.mouse = {
                radius: 4000,
                x: undefined,
                y: undefined
            };
            this.pointerMove = (event) =>{
                this.mouse.x = event.x;
                this.mouse.y = event.y;
            };
            window.addEventListener('mousemove', this.pointerMove);

            canvas.addEventListener("mouseover", () => {
                window.addEventListener('mousemove', this.pointerMove);
            });
            canvas.addEventListener("mouseout", () => {
                window.removeEventListener("mousemove", this.pointerMove);
            });
        }
        init(context){
            context.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
            const pixels = context.getImageData(0,0, this.width, this.height).data; //this.image.width, this.image.height
            // console.log('pixels =>',pixels)
            for (let y = 0; y < this.height; y += this.gap){
                for (let x = 0; x < this.width; x += this.gap){
                    const index = (y * this.width + x) * 4;
                    const r = pixels[index];
                    const g = pixels[index +1];
                    const b = pixels[index +2];
                    const a = pixels[index +3];
                    const color = `rgba(${r},${g},${b},${a / 255})`;

                    if (a > 0){
                        this.particlesArray.push(new Particles(this, x, y, color, this.gap))
                    }
                }
            }
        }
        draw(context){
            this.particlesArray.forEach(part => part.draw(context));
        }
        update(){
            this.particlesArray.forEach(part => part.update());
        }
        warp(){
            this.particlesArray.forEach(part => part.warp());
        }
    }
    const effect = new Effect(canvas.width, canvas.height);
    effect.init(ctx);
    console.log(effect);


    function animate() {
        if (running){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            effect.draw(ctx);
            effect.update();
            raf = window.requestAnimationFrame(animate);
        }
    }
    animate();

    canvas.addEventListener("mouseover", () => {
        raf = window.requestAnimationFrame(animate);
        running = true;
    });
    canvas.addEventListener("mouseout", () => {
        window.cancelAnimationFrame(raf);
        running = false;
    });


    const warpButton = document.getElementById('warpButton');
    warpButton.addEventListener('click', () =>{
        effect.warp()
    })
    // ctx.fillRect(0, 0, 100, 200)
    // ctx.drawImage(image1, canvas.width / 2 , 10, 250, 140)

});



// неизвестные : [
// console.log(str.substring(0))
//Math.pow(2,array1.length); возводит в какую степень первое число из параметров pow()
//fiba = [0,1];
// // for (; fiba.at(-1) < 133029 ;){
// }
//str.replace(/[^a-zA-Z0-9]+/g,'');
//
// ]



// const arrFunc = (arr) => {
//     let obj = {};
//     arr.map((el, i) =>{
//         if( arr.indexOf(el) !== i) {
//             obj = {...obj, [el]: obj[el] + 1}
//         } else {
//             obj = {...obj, [el]: 1}
//         }
//     });
//
//     const newArr = Object.entries(obj);
//     let position;
//     let positionItem;
//
//
//
//     return newArr
// };
// console.log(arrFunc([8,6,0,0,1,2,0,1, 1]));



// цикл для фибвнвчи
// let fiba = [0,1];
// for (; fiba.at(-1) < 133029 ;){
// fiba.push(fiba.at(-1) + fiba.at(-2));
// }
// console.log(fiba);



// вытащить положительное или отрицательное не целое число из строки
// function learnJavaScript() {
//     const stringToNumber = str => {
//         return str.match(/[+-]?\d+(\.\d+)?/g)//  /[+-]?\d+(\.\d+)?/g   //  txt.match(/\d/g) более простой но только на цифрами
//     };
//     return stringToNumber(')as-9asdssad9.2 .dws.ad2,1.9')
// }
// console.log(learnJavaScript());


// '1'
// function reverse_a_number(n) {
//     return + n.toString().split('').reverse().join('')
// }
// document.writeln(console.log(reverse_a_number(258961))); // 169852




// this context
// const me = {
//     name: 'Alisher',
//     age: 22,
//     func :  f1 = function reverse_a_number(age){
//         console.log(this);
//         console.log(age)
//     }
// };
// me.func();




// '2'проверка на палиндромные слова
// function check_Palindrome(str_entry){
//
//     if(str_entry.length === 0 ) return console.log(false);
//     const answer = str_entry.split('').reverse().join() === str_entry.split('').join();
//     console.log(answer ? 'Запись - палиндром' : 'Вход - это не палиндром.')
//
// }

//more complex from wm-school.ru site source
// function check_Palindrome(str_entry){
//     let crsts = str_entry.toLowerCase().replace(/[^a-zA-Z0-9]+/g,'');
//     console.log(crsts);
//
//     let ccount = 0;
//     if (crsts === '') return console.log("Ничего не найдено!")
//     if (crsts.length % 2 === 0){
//         ccount = crsts.length / 2
//     } else if (crsts.length === 1){
//         crsts = 'Запись - палиндром'
//     } else {
//         ccount = (crsts.length - 1 )/ 2
//     }
//     for (let x  = 0; x < ccount; x++){
//         if (crsts[x] !== crsts.slice(-1-x)[0]){
//             return console.log('Вход - это не палиндром.')
//         }
//     }
//     // console.log(ccount)
//     return console.log('Запись - палиндром.  ');
// }

// console.log(1)
// check_Palindrome('level&()()21%$3');
// console.log(2)
// check_Palindrome('topot');
// console.log(3)
// check_Palindrome('that');  // Вход
// console.log(4)
// check_Palindrome('');  // Вход





//'3' Функция, которая генерирует все комбинации строки
// function substrings(str) {
//
//     let answer = str.split('');
//     answer.forEach((el, idx) => {
//         for (let i = 0; i < answer.length; i++){
//             if (i === idx) {
//                 console.log(el)
//             } else {
//                 console.log(el + answer[i])
//             }
//         }
//     });
//
//     console.log(answer)
//
// }

//more complex and correct from wm-school.ru site source
// function substrings(str) {
//     // const array1 = [];
//     // for (let x = 0, y = 1; x < str.length; y++, x++) {
//     //     array1[x] = str.substring(x,y);
//     //     console.log(str.substring(x,y))
//     // }тупо следующий код
//     const array1 = str.split('');
//
//     let combin = [];
//     let temp = '';
//     let strLengthPow = Math.pow(2,array1.length);
//
//     for (let i = 0; i < strLengthPow; i++) {
//         temp = '';
//         for (let j = 0; j < array1.length; j++) {
//             if ((i & Math.pow(2,j))){
//                 temp += array1[j]
//             }
//         }
//         temp && combin.push(temp)
//     }
//
//
//     console.log(array1);
//     console.log(combin)
//     // console.log(str.substring(0))
//
// }
//
// substrings("aziz");



// '4';. Вернуть переданную строку с буквами в алфавитном порядке
// function alphabet_order(str) {
//
//     console.log(str.replace(/[^a-zA-Z]+/g,'').split('').sort().join(''))
//
// }
// alphabet_order('alph:LLNJ2ab%^&etGAKi9ca@1!l0'); // "aaabcehillpt"






// '5'; Найти самое длинное слово в строке
// function find_longest_word(str) {
//     // console.log(str.match(/\w[a-z]{0,}/gi));
//     // console.log(str.replace(/[^a-zA-Z ]+/g,'').split(' '));
//     return str.split(' ').reduce((acc, rec) =>{
//        return  acc.length < rec.length ? rec : acc
//     },'');
//
// }
// console.log(find_longest_word('@Web Development #Tutorial'));








// '6'
// function vowel_count(str1) {
//     var vowel_list = 'aeiouAEIOU';
//     var vcount = 0;
//
//     for(var x = 0; x < str1.length ; x++) {
//         if (vowel_list.indexOf(str1[x]) !== -1) {
//             vcount += 1;
//         }
//
//     }
//     return vcount;
// }
//
// console.log(vowel_count('Web Development Tutorial'));



// '7';Проверьте, является ли число простым или нет
// function test_prime(n) {
//     if (n === 1) return false;
//     if (n === 2) return true;
//     for (let i = 2; i < n; i++){
//         if (n % i === 0) return false
//     }
//     return true
// }
//
// console.log(test_prime(51)); // false






'8';
// function detect_data_type(value) {
//
// return typeof(value)
// }

//more complex and correct from wm-school.ru site source
// function detect_data_type(value) {
//     let dtypes = [Function, RegExp, Number, String, Boolean, Object], x, len;
//
//     if (typeof value === "object" || typeof value === "function") {
//         for (x = 0, len = dtypes.length; x < len; x++)  {
//             if (value instanceof dtypes[x])  {
//                 return dtypes[x];
//             }
//         }
//     }
//     console.log(value instanceof dtypes[1]);
//     return typeof(value)
// }
//
// console.log(detect_data_type(/[^a-zA-Z]+/g)); // number




'9';
// function matrix(n) {
//     for (let i = 0; i< n; i++){
//         let temp = [];
//         for (let x = 0; x< n; x++){
//             temp[x] = x === i ? 1 : 0
//         }
//         console.log(temp)
//     }
// }
//
// matrix(6);




'10';
// Найдите второе наименьшее и второе наибольшее числа из массива
// function second_greatest_lowest(arr_num) {
//     let uniqA = arr_num.filter((el,i) => arr_num.indexOf(el) === i)
//     let sortArr = uniqA.sort((a,b) => a - b);
//     let answer = [];
//         answer.push(sortArr.at(1), sortArr.at(-2));
//
//
//     return answer.join(',')
// }
//
// console.log(second_greatest_lowest([8,7,9,8,8, 9, 10, 11,12, 12])); // 9,11





// '11'Найдите идеальное число
// совершенное число - это число, равное половине суммы всех его положительных делителей (включая само себя).
// первое совершенное число - 6 :  (1 + 2 + 3 + 6) / 2 = 6
// function is_perfect(n) {
//     let answer = [];
//     for (let i = 0; i <=  n; i++){
//         if (n % i === 0) answer.push(i)
//     }
//     if (answer.reduce((acc,rec) => acc + rec) / 2 === n){
//        return  console.log(true)
//     }
//     console.log( false);
//     console.log('(' +answer + ') / 2 = '+ answer.reduce((acc,rec) => acc + rec) / 2 )
// }
// is_perfect(18 );


'12';
// Найти множители положительного целого числа.
//more complex from wm-school.ru site source
// function factors(n) {
//     let num_factors = [], i;
//     let count = 0;
//
//     for (i = 1; i <= Math.floor(Math.sqrt   (n)); i++){
//         count++;
//         if (n % i === 0)  {
//             num_factors.push(i);
//             if (n / i !== i)
//                 num_factors.push(n / i);
//         }
//     }
//     num_factors.sort((x, y) =>  x - y);
//
//     console.log(Math.floor(Math.sqrt(n)));
//     return num_factors + ' runs ' + count;
// }
//
// console.log(factors(240));



13;
// Преобразование суммы в монеты.








14;
// Вычислить значение b n, где n - показатель степени, а b - основание.
// function exp(b,n) {
//     // ваш код
//     return b**n
// }
//
// console.log(exp(3, 4));



15;
// Поиск в массивах JavaScript с помощью двоичного поиска
// function binarySearch(value, list) {
//     let mid;
//
//
// }
// const myArray = [1, 2, 3, 5, 6, 7, 10, 11, 14, 15, 17, 19, 20, 22, 23];
// console.log(binarySearch(6, myArray)); // 4




const readableTimetable = (workdays) => {
    let answer = [];

    if (workdays) {
        let days = {'mon': 'MON', 'tue': 'TUE', 'wed': 'WED', 'thu': 'THU', 'fri': 'FRI', 'sat': 'SAT', 'sun': 'SUN'};
        let doubleDay = '';

        workdays.map((el, i, arr) => {
            answer.push(`${days[el.day]}: ${el.from} - ${el.to}`)
        });


    }

    return answer.join(`
    
    `)
};



console.log(readableTimetable(
    [
        {"day": "mon", "from": "11:00", "to": "23:00"},
        {"day": "tue", "from": "11:00", "to": "22:00"},
        {"day": "wed", "from": "11:00", "to": "23:00"},//2
        {"day": "thu", "from": "12:00", "to": "22:00"},
        {"day": "fri", "from": "12:00", "to": "23:00"},
        {"day": "sat", "from": "10:00", "to": "22:00"},
        {"day": "sun", "from": "11:00", "to": "23:00"}
    ]
));