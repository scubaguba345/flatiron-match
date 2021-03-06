const url = "http://localhost:3000/cards"
const userurl = "http://localhost:3000/users"
const commenturl = "http://localhost:3000/comments"
const form = document.getElementById('form')
const commentForm = document.getElementById('comment-form')
const userComment = document.getElementById('user-comment')


document.addEventListener("DOMContentLoaded", () => {

    function fetchCards() {
        fetch(url)
        .then(resp => resp.json())
        .then(data => data.forEach(cards => renderCards(cards)))
    }

    function fetchComments() {
        fetch(commenturl)
        .then(resp => resp.json())
        .then(data => data.forEach(comment => renderComment(comment)))
    }

    function fetchUsers() {
        fetch(userurl)
        .then(resp => resp.json())
        .then(data => data.forEach(data => renderUser(data)))
    }

    function renderCards(cards) {
        const frontFace = document.getElementById('memory-game')
        const div = document.createElement('div')
        div.className = 'memory-card'
        div.id = cards.id
        div.innerHTML = `      
            <img class="front-face" src=${cards.cardside}> 
            <img class="back-face" src="https://cdn.bootcamprankings.com/spai/w_210+q_lossy+ret_img+to_webp/https://bootcamprankings.com/wp-content/uploads/2019/10/36776548_1553913434714928_4773274533622710272_n.png">
        `
        frontFace.append(div)
    }   

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function flipCard(card) { 
        if (lockBoard) return;
        if (card === firstCard) return;
        card.classList.add('flip');
    
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = card;
            return;
        }

        secondCard = card;

        checkForMatch();
    }

    function checkForMatch() {
        if (firstCard.children[0].src  === secondCard.children[0].src) {
            disableCards();
        return;
        }

        unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            resetBoard();
        }, 1500);
    }

    //need to fix          
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    const memoryCard = document.querySelectorAll('.memory-card');
    //need to fix
    (function shuffle() {
        memoryCard.forEach(card => {
            document.getElementById('memory-game').style.order
          let ramdomPos = Math.floor(Math.random() * 16);
        card.style.order = ramdomPos;
        });
    })();

    fetchCards()
    fetchUsers()
    fetchComments()

    function postUser(username) {
        fetch(userurl, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            
            body: JSON.stringify({
               "name": username
            })
        })
        .then(resp =>resp.json())
        .then(data => renderUser(data))
    }

    
    function renderUser(data) {
        const userDiv = document.getElementsByName('show-user-name')[0]
        userDiv.innerHTML = `
        Welcome, ${data.name}! Enjoy the Game!
        <button class="delBtn" type="button">Delete User</button>
        `
        // const userUl = document.createElement('ul')
        userDiv.className = 'uname'
        userDiv.id = data.id
        // userUl.innerHTML = `${data.name}
        // `
        // ul.append(userUl)
    }

    
    function deleteUser(id) {
        const uname = document.getElementById(id)
        fetch(`${userurl}/${id}`, {method: "DELETE"})
        uname.remove() 
    }

    function postComment(text, userId) {
        fetch(commenturl, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            
            body: JSON.stringify({
               "text": text,
               "user_id": userId
            })
        })
        .then(resp =>resp.json())
        .then(comment => renderComment(comment))
    }


    function renderComment(comment) {
        const commentCard = document.createElement('span')
        commentCard.className = 'commentCard'
        commentCard.id = comment.id
        commentCard.innerHTML = `${comment.text} 
        <button class="delComBtn" type="button">Delete</button><br><br>`
        userComment.append(commentCard)
    }

    function deleteComment(id) {
        fetch(`${commenturl}/${id}`, {method: "DELETE"})
        const commentCard = document.getElementById(id)
        commentCard.remove() 
    }

//listeners

    document.addEventListener('submit', function(e) {
        e.preventDefault();
        if(e.target.id === "form"){
            console.log(e.target)
        let username = form.username.value
        postUser(username);
        form.reset()
        } else if (e.target.id === "comment-form") {
            let text = commentForm.comment.value
            let userId = commentForm.parentElement.parentElement.parentElement.children[1].children[0].children[0].id
            postComment(text, userId)
            commentForm.reset()
        }
    })
                
    document.addEventListener('click', function(e) {
        if(e.target.className === 'back-face'){
            flipCard(e.target.parentElement)
        } 
        else if (e.target.className === 'delBtn'){
            let id = e.target.parentElement.id
            deleteUser(id)
        } 
        else if (e.target.className === 'delComBtn'){
            let id = e.target.parentElement.id
            deleteComment(id)
        }
    })
    
})