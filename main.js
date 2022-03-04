//QUERY SELECTORS
const submit = document.querySelector('#submit')
const titleContent = document.querySelector('#title-content')
const noteContent = document.querySelector('#note-content')
const alerts = document.querySelector('#alert')
const notes = document.querySelector('#notes')
const modal = document.querySelector('.modal-container')
const modalCloseBtn = document.querySelector('#close-modal')


//FUNCTIONS 
const ui = {
    checkInputs() {
        const title = titleContent.value
        const note = noteContent.value
        if (title == null || title == '') {
            ui.displayAlert('Please enter a title.', 'rgb(206, 57, 57)')


        } else if (note == null || note == '') {
            ui.displayAlert('Please enter a note.', 'rgb(206, 57, 57)')
        } else {
            ui.addNewNote(Math.random(), title, note, true)
            titleContent.value = ''
            noteContent.value = ''
            ui.displayAlert('Note successfully added!', 'rgb(10, 190, 10)')
        }
    },
    displayAlert(msg, color) {
        alerts.style.backgroundColor = `${color}`
        alerts.textContent = `${msg}`
        alerts.classList.add('active')
        setTimeout(() => {
            alerts.classList.remove('active')
            alerts.textContent = ''
        }, 3000)
    },
    addNewNote(id, title, content, saveToStorage) {

        const newNote = document.createElement('div')
        newNote.classList.add('note')
        newNote.dataset.id = id
        //note title
        const noteTitle = document.createElement('h2')
        noteTitle.classList.add('note-title')
        noteTitle.textContent = title
        //note content
        const noteContent = document.createElement('p')
        noteContent.classList.add('note-text')
        noteContent.textContent = content
        //buttons
        const buttons = document.createElement('div')
        buttons.classList.add('buttons')
        const viewBtn = document.createElement('button')
        viewBtn.classList.add('view')
        viewBtn.textContent = 'View Detail'
        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('delete')
        deleteBtn.textContent = 'Delete Note'
        buttons.appendChild(viewBtn)
        buttons.appendChild(deleteBtn)
        //append to note
        newNote.appendChild(noteTitle)
        newNote.appendChild(noteContent)
        newNote.appendChild(buttons)
        //append note to notes
        notes.appendChild(newNote)

        if(saveToStorage){
            const note = {
                id: newNote.dataset.id,
                title: noteTitle.textContent,
                content: content.textContent
            }
            storage.saveNote(note)
        }
    },
    deleteNote(note) {
        note.remove()
        ui.closeModal()
        ui.displayAlert('Your note was permanently deleted.', 'rgb(58, 92, 185)')
    },
    refreshNotes() {
        const uiNotes = document.querySelectorAll('note')

        uiNotes.forEach(note => note.remove())
        const currentNotes = storage.getNotes()
        currentNotes.forEach(note => {
            ui.addNewNote(note.id, note.title, note.content, false)
        })
    },
    openModal(title, note, xpos, ypos) {
        const noteTitle = modal.querySelector('h2')
        const noteContent = modal.querySelector('p')
        noteTitle.textContent = title
        noteContent.textContent = note

        modal.style.top = ypos
        modal.style.left = xpos
        modal.style.display = 'block'
    },
    closeModal() {
        modal.style.display = 'none'
    }
}

//STORAGE   
const storage = {
    saveNote(object) {
        const currentNotes = storage.getNotes()
        if (currentNotes === null || currentNotes === '') {
            localStorage.setItem('notesapp.notes', JSON.stringify(object))
        } else {
            currentNotes.push(object)
            localStorage.setItem('notesapp.notes', JSON.stringify(currentNotes))
        }
    },
    getNotes() {
        let currentNotes
        if (localStorage.getItem('notesapp.notes') === null) {
            currentNotes = []
        } else {
            currentNotes = JSON.parse(localStorage.getItem('notesapp.notes'))
        }
        return currentNotes
    },
    deleteNote(id) {
        const currentNotes = storage.getNotes()
        currentNotes.forEach((note, index) => {
            if (note.id == Number(id)) {
                currentNotes.splice(index, 1)
            }
            localStorage.setItem('notesapp.notes', JSON.stringify(currentNotes))
        })
    }
}

//EVENT LISTENERS  

//Event: submit btn 
submit.addEventListener('click', () => {
    ui.checkInputs()

})
//Event: delete and view btns
document.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
        const noteToDelete = e.target.closest('.note')
        ui.deleteNote(noteToDelete)
        storage.deleteNote(noteToDelete.dataset.id)
    } else if (e.target.classList.contains('view')) {
        const selectedNote = e.target.closest('.note')
        const modalTitle = selectedNote.querySelector('h2')
        const modalContent = selectedNote.querySelector('p')
        //get y positon of modal 
        const { clientX: mouseX, clientY: mouseY } = e
        let ypos = `${mouseY + window.scrollY - 140}px`
        let xpos = `${mouseX}px`
        ui.openModal(modalTitle.textContent, modalContent.textContent, xpos, ypos)
    }
})
//Event: modal close button (x)
modalCloseBtn.addEventListener('click', () => {
    ui.closeModal()
})

//Event:escape key
document.addEventListener('keydown', e => {
    if (e.key === "Escape") {
        if (modal.style.display === 'block') {
            modal.style.display = 'none'
        }
        //else if (other menus to close)
    }
})

//Event: Window Load 
window.addEventListener('DOMContentLoaded', () => {
    //update ui
    ui.refreshNotes()
})