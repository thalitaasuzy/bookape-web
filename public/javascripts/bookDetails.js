    document.addEventListener('DOMContentLoaded', function() {
        const params = new URLSearchParams(window.location.search);
        const bookKey = params.get('key');

        if (!bookKey) {
            document.getElementById('book-details').innerHTML = '<p>Detalhes do livro não disponíveis.</p>';
            return;
        }

        const url = `https://openlibrary.org${bookKey}.json`;

        fetch(url)
            .then(response => response.json())
            .then(book => {
                const detailsContainer = document.getElementById('book-details');

                const bookCover = book.covers ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : 'https://via.placeholder.com/200x300?text=Sem+Capa';
                const authors = book.authors ? book.authors.map(author => author.name).join(', ') : 'Desconhecido';
                const subjects = book.subjects ? book.subjects.join(', ') : 'Desconhecido';

                detailsContainer.innerHTML = `
                    <img src="${bookCover}" alt="${book.title}">
                    <h2>${book.title}</h2>
                    <p><strong>Autor:</strong> ${authors}</p>
                    <p><strong>Ano de Publicação:</strong> ${book.publish_date || 'Desconhecido'}</p>
                    <p><strong>Gêneros:</strong> ${subjects}</p>
                    <p><strong>Páginas:</strong> ${book.number_of_pages || 'Desconhecido'}</p>
                `;
            })
            .catch(error => {
                console.error('Erro ao buscar os detalhes do livro:', error);
                document.getElementById('book-details').innerHTML = '<p>Erro ao carregar os detalhes do livro.</p>';
            });
    });