async function getDate(place = 'Bishkek') {

    const url = 'https://timezone.abstractapi.com/v1/current_time/?api_key=b02b5d13a5614ea3a9d47f9778dc5ad9&location=' + place;
    document.getElementById('time').innerText = `${place}'s time`

    const response = await fetch(url)
    const date = await response.json()
    const time = date.datetime;

    document.getElementById('time').innerText += ` = ${time} ${date.timezone_abbreviation}`
}
// getDate()
document.querySelectorAll('.allPaths').forEach(el => {
    el.addEventListener('mouseover', () => {
        window.onmousemove = (j) => {
            x = j.clientX
            y = j.clientY
            document.getElementById('name').style.top= y - 20+'px'
            document.getElementById('name').style.left= x - 20+'px'
        }
        el.style.fill = '#4d71a5'
        document.getElementById('name').innerText = el.id
        document.getElementById('name').style.opacity = '1'
    })

    el.addEventListener('mouseleave', () => {
        el.style.fill = '#ececec'
        document.getElementById('name').style.opacity = '0'
    })
    el.addEventListener('click', () => {
        getDate(el.id)
        el.style.fill = '#3c31dd'
    })
})