const accordionsItems = document.querySelectorAll('.accordion-item');

accordionsItems.forEach(item => {
    const img = item.querySelector('.accordion-item_headerbox_img');
    const content = item.querySelector('.accordion-item_content');

    item.addEventListener('click', () => {

        content.classList.toggle('hidden');

        if (content.classList.contains('hidden')) {
            img.src = 'assets/images/icon-plus.svg';
        } else {
            img.src = 'assets/images/icon-minus.svg';
        }
    })
});