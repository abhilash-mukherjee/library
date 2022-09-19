let myLibrary = [];
class Book{
    constructor(title,author,pages,haveRead)
    {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.haveRead = haveRead;
        this.isDisplayed = false;
        Book.bookCount++;
        this.bookID = Book.bookCount;
    }

    info()
    {
        let str1 = `${this.title} by ${this.author}, ${this.pages}, `;
        let str2 = this.haveRead ? 'already read.' : "haven't read yet.";
        return str1 + str2;
    }
    static bookCount = 0;
}

const formInput = {

    titleInp: '',
    authorInp: '',
    pagesInp: '',
    haveReadInp:'',
    
    submit()
    {
        const book = createBook(this.titleInp,this.authorInp,this.pagesInp,this.haveReadInp);
        addBookToLibrary(book);
    }
}

function addBookToLibrary(book)
{
    myLibrary.push(book);
}

function removeBook(book)
{
    myLibrary.splice(myLibrary.indexOf(book),1);
    Book.bookCount--;
}

function createBook(title,author,pages,haveRead)
{
    return new Book(title,author,pages,haveRead);
}

function displayAllBooks()
{
    for(let book of myLibrary)
    {
        console.log(book.info());
    }
}

// const atomicHabits = new Book('Atomic Habits','James Clear',256,true);
// const thinkAndGrowRich = new Book('T N G R','Nepolean Hill',400,true);
// const fourHourWorkWeek = new Book('4 Hr Work Week','Tim Ferris',300,false);
// const zeroToOne = new Book('Zero To One','Peter Theil',250,true);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*UI*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const titleInp = document.querySelector('#title');
const authorInp = document.querySelector('#author');
const pagesInp = document.querySelector('#pages');
const haveReadInp = document.querySelector('#is-read');
const form = document.querySelector('form');
const submitBtn = document.querySelector('#submit-book');
const addNewBookBtn = document.querySelector('#add-book');
const addNewBookPanel = document.querySelector('.add-book-panel');
addNewBookPanel.addEventListener('click',toggleBookPanel,{capture:false});
hideElement(addNewBookPanel);
addNewBookBtn.addEventListener('click',()=>
{
    showElement(addNewBookPanel);
})

submitBtn?.addEventListener('click',
()=>
{
    const formUI = document.querySelectorAll('.form-inp') 
    for(let inp of formUI)
    {
        if(!inp.checkValidity()){
            allInpValid = false;
            form.reportValidity();
            break;
        }
        allInpValid = true;
    }
    if(allInpValid)
    {
        console.log('submitted');
        formInput.authorInp = authorInp.value;
        formInput.titleInp = titleInp.value;
        formInput.pagesInp = pagesInp.value;
        formInput.haveReadInp = haveReadInp.checked;
        formInput.submit();
        form.reset();
        hideElement(addNewBookPanel);
        updateLibraryUI();
    }
});

function hideElement(element)
{
    element.classList.add('hidden');
    element.classList.remove('active');
}

function showElement(element)
{
    element.classList.remove('hidden');
    element.classList.add('active');
}

function toggleBookPanel(e)
{
    if(e.target !==this) return;
    hideElement(addNewBookPanel);
}

function updateLibraryUI()
{
    const body = document.querySelector('body');
    bookPanels = document.querySelectorAll('.book-panel');
    while(bookPanels.length > myLibrary.length)
    {
        body.removeChild(bookPanels[bookPanels.length - 1]);
        bookPanels = document.querySelectorAll('.book-panel');
    }
    while(bookPanels.length < myLibrary.length)
    {
        body.appendChild(createPanel(myLibrary[bookPanels.length]));
        bookPanels = document.querySelectorAll('.book-panel');
    }
}

function createPanel(book)
{
    const panel = document.createElement('div');
    panel.classList.add('book-panel');
    panel.dataset.bookId = book.bookID;
    panel.appendChild(createTextElement(book.title,['book-title']));
    panel.appendChild(createTextElement(`by ${book.author}`,['book-author']));
    panel.appendChild(createTextElement(`${book.pages} pages`,['book-pages']));    
    let readStatusBtn;
    if(book.haveRead)
    {
        readStatusBtn = createButton('Read',['book-read'])
    }
    else{
        readStatusBtn = createButton('Not Read',['book-not-read'])
    }
    
    panel.appendChild(readStatusBtn);
    const removeBtn = createButton('Remove' ,['remove-btn']);
    panel.appendChild(removeBtn);
    readStatusBtn.addEventListener('click',toogleBookReadStatus);
    removeBtn.addEventListener('click',onBookRemoved);
    return panel;
}

function createTextElement(content,classList)
{
    const textElement = document.createElement('div');
    textElement.textContent = content;
    for(let className of classList)
    {
        textElement.classList.add(className);
    }
    return textElement;
}

function createButton(content,classList)
{
    const btn = document.createElement('button');
    btn.textContent = content;
    for(let className of classList)
    {
        btn.classList.add(className);
    }
    return btn;
}

function onBookRemoved(e)
{
    const book = getBookFromPanel(e.target.closest('.book-panel'));
    removeBook(book);
    updateLibraryUI();
}

function getBookFromPanel(panel)
{
    const id = panel.getAttribute('data-book-id');
    return myLibrary.find(b => b.bookID === parseInt(id));
}

function toogleBookReadStatus(e)
{
    const panel = e.target.closest('.book-panel');
    const book = getBookFromPanel(panel);
    let btn;
    if(book.haveRead)
    {
        book.haveRead = false;
        btn = createButton('Not Read',['book-not-read']);
    }
    else{
        book.haveRead = true;
        btn = createButton('Read',['book-read']);
    }
    panel.insertBefore(btn,e.target);
    btn.addEventListener('click',toogleBookReadStatus);
    panel.removeChild(e.target)
}