const ratingForm = document.querySelector('#rating-form');

ratingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const selectedRating = document.querySelector('input[name="rating"]:checked');

    if (selectedRating) {
        const ratingValue = selectedRating.value;

        document.querySelector('.thank-you-container_selected-raiting').textContent = `You selected ${ratingValue} out of 5`;
        document.querySelector('.rating-container').classList.add('hidden');
        document.querySelector('.thank-you-container').classList.remove('hidden');
    } else {
        alert('Please select a rating before submitting.');
    }
})