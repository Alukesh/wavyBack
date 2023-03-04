"use strict"

document.addEventListener('DOMContentLoaded', function (params) {
    const form = document.getElementById('form');
    form.addEventListener('submit', event => formSend(event, 'sendmail.php'))

    async function formSend(e, php) {
        e.preventDefault();
        let error = formValidate(form)
        // let formData = new FormData(form)
        // formData.append('image', formImage.files[0]);

        // if (error === 0) {
        //     form.classList.add('_sending');
        //     const response = await fetch('sendmail.php', {
        //         method: 'POST',
        //         body: formData,
        //     })
        //     if (response.ok) {
        //         let result = await response.json();
        //         alert(response.message);
        //         form.classList.remove('_sending')
        //         formPreview.innerHTML = '';
        //         form.reset();
        //     } else {
        //         alert('Не удалось отправить')
        //         form.classList.remove('_sending')
        //     }


        // } else {
        //     alert('Заполните обязательные поля')
        //     form[0].focus()
        // }
        var req = new XMLHttpRequest();
        req.open('POST', php, true);
        req.onload = function () {
            if (req.status >= 200 && req.status < 400) {
                json = JSON.parse(this.response); // Ебанный internet explorer 11
                console.log(json);

                // ЗДЕСЬ УКАЗЫВАЕМ ДЕЙСТВИЯ В СЛУЧАЕ УСПЕХА ИЛИ НЕУДАЧИ
                if (json.result == "success") {
                    // Если сообщение отправлено
                    alert("Сообщение отправлено 2");
                } else {
                    // Если произошла ошибка
                    alert("Ошибка. Сообщение не отправлено 2");
                }
                // Если не удалось связаться с php файлом
            } else { alert("Ошибка сервера. Номер: " + req.status); }
        };

        // Если не удалось отправить запрос. Стоит блок на хостинге
        req.onerror = function () { alert("Ошибка отправки запроса 2"); };
        req.send(new FormData(e.target));
    }


    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
                formAddError(input)
                error++
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            } 

        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }


    //Получение инпута file в переменную
    const formImage = document.getElementById('formImage');
    const formPreview = document.getElementById('formPreview');

    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0])
    })

    function uploadFile(file) {
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert("Разрешены только изображения.")
            formImage.value = '';
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Фацл должен быть менее 2 МБ.')
            return
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="photo"/>`
            console.log(e.target.result);
        }
        reader.onerror = function (e) {
            alert("file error")
        }
        reader.readAsDataURL(file);


    }

})