const open_file = document.getElementById('openfile')
const save_file = document.getElementById('savefile')
const text_body = document.getElementById('textbody')
const file_path = document.getElementById('filepath')

open_file.onclick = () => {
    window.aplikasiku.open((path, content) => {
        file_path.innerText = path
        text_body.value = content
    })
}

save_file.onclick = () => {
    let path = file_path.innerText
    let content = text_body.value
    window.aplikasiku.save(path, content)
}