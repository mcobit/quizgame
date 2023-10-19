createAdditionalFields()
eventHandlers()

let emailverify = false
let passwordverify = false
let checkmarkverify = false

async function eventHandlers() {

    document.getElementById('signupform').addEventListener('submit', async function (e) {
        e.preventDefault()
    })

    document.getElementById('email_retype').addEventListener('keyup', async function () {
        checkEmail()
    })
    document.getElementById('email_retype').addEventListener('change', async function () {
        checkEmail()
    })
    document.getElementById('email').addEventListener('keyup', async function () {
        checkEmail()
    })
    document.getElementById('email').addEventListener('change', async function () {
        checkEmail()
    })

    function checkEmail() {
        const email = document.getElementById('email')
        const email_retype = document.getElementById('email_retype')
        if (email.value != '' && email_retype.value != '' && email_retype.value === email.value) {
            email_retype.classList.remove('fail')
            email.classList.remove('fail')
            email_retype.classList.add('success')
            email.classList.add('success')
            emailverify = true
        } else {
            email_retype.classList.remove('success')
            email.classList.remove('success')
            email_retype.classList.add('fail')
            email.classList.add('fail')
            emailverify = false
        }
    }

    function checkPassword() {
        const password = document.getElementById('password')
        const password_retype = document.getElementById('password_retype')
        if (password.value != '' && password_retype.value != '' && password_retype.value === password.value) {
            password_retype.classList.remove('fail')
            password.classList.remove('fail')
            password_retype.classList.add('success')
            password.classList.add('success')
            passwordverify = true
        } else {
            password_retype.classList.remove('success')
            password.classList.remove('success')
            password_retype.classList.add('fail')
            password.classList.add('fail')
            passwordverify = false
        }
    }

    document.getElementById('password_retype').addEventListener('keyup', async function () {
        checkPassword()
    })
    document.getElementById('password_retype').addEventListener('change', async function () {
        checkPassword()
    })

    document.getElementById('password').addEventListener('keyup', async function () {
        checkPassword()
    })
    document.getElementById('password').addEventListener('change', async function () {
        checkPassword()
    })

    document.getElementById('submit').addEventListener('click', async function (e) {
        e.preventDefault()

        checkmarkverify = document.getElementById('privacyagree').checked

        if (emailverify && passwordverify && checkmarkverify) {
            const image = document.getElementById('image')
            const form = document.getElementById('signupform')
            const formdata = new FormData(form)

            const objectform = Object.fromEntries(formdata)
            objectform.image = 'none'

            const good = await addentry('signup', objectform)
            if (good == 'ok') {
                if (image && image.files.length != 0) {
                    let imagedata = new FormData()
                    imagedata.append('type', 'user')
                    imagedata.append('imagetype', 'image')
                    for (const key of Object.keys(objectform)) {
                        if (key != 'image') {
                            imagedata.append(key, objectform[key])
                        }
                    }
                    imagedata.append('image', image.files[0])
                    await upload('user', 'image', imagedata)
                }
                form.remove()
                document.getElementById('content').replaceChildren(document.createTextNode('Thank your for registering! You will hear from us soon.'))
            }
        } else {
            let message = document.createElement('div')
            message.className = 'badmessagebox'
            if (!emailverify) {
                message.textContent = "email fields don't match or empty"
                let messagebox = document.getElementById('messagebox')
                if (messagebox) {
                    document.getElementById('messagebox').replaceChildren(message)
                }
            }
            if (!passwordverify) {
                message.textContent = "password fields don't match or empty"
                let messagebox = document.getElementById('messagebox')
                if (messagebox) {
                    document.getElementById('messagebox').replaceChildren(message)
                }
            }
            if (!checkmarkverify) {
                message.textContent = "please agree to the privacy policy"
                let messagebox = document.getElementById('messagebox')
                if (messagebox) {
                    document.getElementById('messagebox').replaceChildren(message)
                }
            }
        }
    })

    document.getElementById('image').addEventListener('change', async function () {
        let reader = new FileReader()
        reader.onload = function () {
            let output = document.getElementById('imagepreview')
            output.src = reader.result
        };
        reader.readAsDataURL(document.getElementById('image').files[0])
    })

}

async function createAdditionalFields() {

    const toprow = document.createElement('div')
    toprow.style = "background-color: white; flex-wrap: wrap; display: flex; position: sticky; justify-content: space-between;"
    toprow.appendChild(document.createTextNode('required fields are marked with an *'))

    const messagebox = document.createElement('div')
    messagebox.id = "messagebox"

    const submitbutton = document.createElement('button')
    submitbutton.type = 'button'
    submitbutton.textContent = 'sign up'
    submitbutton.classList.add('signupsubmit')
    submitbutton.id = "submit"

    signupformwrapper.appendChild(messagebox)
    signupformwrapper.appendChild(submitbutton)

    document.getElementById('signupform').prepend(toprow)
}

async function createLoadicon() {
    const loadicon = document.createElement('div')
    loadicon.classList.add('loadicon')
    loadicon.id = 'loadicon'
    document.body.appendChild(loadicon)
}

async function removeLoadicon() {
    document.getElementById('loadicon').remove()
}

async function addentry(type, formdata) {
    try {
        createLoadicon()
        const response = await fetch('/' + type, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formdata)
        })
        const json = await response.json()
        if (response.status == '201' || response.status == '200') {
            removeLoadicon()
            return 'ok'
        } else {
            const message = document.createElement('div')
            message.className = 'badmessagebox'
            let error = json.message
            if (error.includes('E11000')) {
                error = type + ' with ' + error.split("{ ")[1].split(" }")[0] + ' already exists!'
            }
            if (error.includes('required')) {
                error = 'The field "' + error.split('`')[1] + '" is required!'
            }
            error = error.replace(/<[^>]*>/g, '')
            error = error.replace(/&nbsp;/g, ' ')
            const text = document.createTextNode(error)
            message.appendChild(text)
            const messagebox = document.getElementById('messagebox')
            if (messagebox) {
                document.getElementById('messagebox').replaceChildren(message)
            }
        }
        removeLoadicon()
    } catch (e) {
        console.log(e)
    }
    return
}

async function upload(type, imagetype, formdata) {
    try {
        createLoadicon()
        await fetch('/' + imagetype + 'upload', {
            method: 'POST',
            body: formdata,
            headers: {
                processData: false, contentType: false,
            },
        })
        removeLoadicon()
    } catch (e) {
        console.log(e)
    }
    return
}