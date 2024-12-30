function sortAllItems(){
    const albums = Array.from(document.querySelectorAll('.e-album'));
    const container = albums[0].parentNode;
    const originalIndex = Array.from(container.children).indexOf(albums[0]);

    albums.forEach(album => container.removeChild(album));
    albums.sort((a, b) => {
        const titleA = a.querySelector('.e-text > .title').textContent.trim();
        const titleB = b.querySelector('.e-text > .title').textContent.trim();
        return titleA.localeCompare(titleB);
    });


    const originalPosition = container.children[originalIndex];

    albums.forEach(album => {
    container.insertBefore(album, originalPosition)});
}