const loginform = document.getElementById('loginform')

loginform.addEventListener('submit', async function (event) {
    try {
        event.preventDefault()
        const data = new FormData(loginform)
        const response = await fetch('/login', {
            method: 'POST',
            body: new URLSearchParams(data)
        })
        if (response.redirected) {
            window.location.href = response.url
            return
        } else {
            const message = document.createElement('div')
            message.className = 'badmessagebox'
            const text = document.createTextNode('Wrong username or password!')
            message.appendChild(text)
            const messagebox = document.getElementById('messagebox')
            if (messagebox) {
                document.getElementById('messagebox').replaceChildren(message)
            }
        }
    } catch (e) { }
    return 0
})