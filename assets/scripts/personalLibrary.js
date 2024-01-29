const booksTableBody = $("#booksTbl tbody");
booksTableBody.empty();

//Array contains books stored for Personal Library
var BooksToAdd = JSON.parse(localStorage.getItem('addedBooks')) || [];

function populate(){

    const jsonString = JSON.stringify(BooksToAdd);
    console.log(`BooksToAdd = ${jsonString}`);

    $.each(BooksToAdd, function(index, book){

        console.log(`Index = ${index}. Book = ${book}`);

        const newRowHtml = `<tr data-book-id="${book._id}">
            <td>${book._id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>
                <button id="removeBtn" data-book-id="${book._id}">Remove</button>
            </td>
        </tr>`;

        booksTableBody.append(newRowHtml);

    });
}

populate();



$(booksTableBody).on('click', "#removeBtn", function(){
    const bookId = $(this).data('book-id');
    const book = BooksToAdd.find(n => n._id === bookId);

    console.log(`Selected book: ${book.title}`)
    
    $("#remove-title").text(book.title);
    $("#removeModal").show();

    localStorage.setItem('bookToBeRemovedId', bookId);
})

$("#closeEditModalSpn").click(function(){
    $("#editModal").hide();
});

$("#cancelRemoveBtn").click(function(){
    $("#removeModal").hide();
});

$("#confirmBtn").click(function(){

    // Get id of book to be removed
    var bookId = localStorage.getItem('bookToBeRemovedId');

    //console.log('bookId from localstorage = ', bookId);

    // Find id in Personal Library book array
    const index = BooksToAdd.findIndex(book => book._id == bookId);

    //console.log('all books = ', BooksToAdd);
    //console.log('index == ', index);


    if(index !== -1){
        BooksToAdd.splice(index,1);
        localStorage.setItem('addedBooks', JSON.stringify(BooksToAdd));
        localStorage.removeItem('bookToBeRemovedId');
    } else {
        console.log('Book not found')
    }
 
    $("#removeModal").hide();
    location.reload();

})