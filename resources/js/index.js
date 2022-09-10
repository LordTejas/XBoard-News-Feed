// Index.js


const AccordianParent = document.getElementById('news-accordian');


const NewsPortals = [
    {
        title: 'Indian Sports',
        link: 'https://flipboard.com/topic/indiansports.rss'
    },

    {
        title: 'Technology',
        link: 'https://flipboard.com/topic/technology.rss'
    },
    {
        title: 'Indian Economy',
        link: 'https://flipboard.com/topic/indianeconomy.rss'
    }
]


const getJsonFromRss = async (url) => {
    // Returns JSON Response from given URL

    try {
        const json_api_url = `https://api.rss2json.com/v1/api.json?rss_url=${url}`;
    
        let response = await fetch(json_api_url);
        response = await response.json();

        return response;   

    } catch (err) {
        console.log(err);
        return null;
    }
}


const addNewsFromLinkToDOM = async (title, url, index) => {
    try {

        // Fetch News from API
        let news = await getJsonFromRss(url);
        news = news.items;

        // Create Accordian Element
        const newsAccordianElem = document.createElement('div');
        newsAccordianElem.id = 'sports-news';
        newsAccordianElem.className = 'accordion-item';
        newsAccordianElem.innerHTML = `
        <h2 class="accordion-header" id="news-heading-${index + 1}">
            <button class="accordion-button${index == 0 ? "" : " collapsed"}" data-bs-toggle="collapse" data-bs-target="#collapse${index+1}" aria-expanded=${index == 0 ? "true" : "false"} aria-controls="collapseOne">
                ${title}
            </button>
        </h2>

        <div id="collapse${index+1}" class="accordion-collapse collapse${index == 0 ? " show" : ""}" aria-labelledby="#news-heading-${index + 1}" data-bs-parent="#news-accordian">
            <div class="accordion-body">
                <div id="news-carousel-${index + 1}" class="carousel slide" data-bs-ride="carousel-dark">
                    <div class="carousel-inner"></div>

                    <i type="button" class="fa-solid fa-chevron-left news-control-btn news-carousel-prev-btn" id="news-carousel-btn-${index+1}" data-bs-target="#news-carousel-${index + 1}" data-bs-slide="prev"></i>
                    <i type="button" class="fa-solid fa-chevron-right news-control-btn news-carousel-next-btn" id="news-carousel-btn-${index+1}" data-bs-target="#news-carousel-${index + 1}" data-bs-slide="next"></i>

                </div>
            </div>
        </div>
        `;

        // Fill its inner carousel
        const innerCarouselElem = newsAccordianElem.getElementsByClassName('carousel-inner')[0];

        news.forEach((news, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index === 0) carouselItem.classList.add('active');
            carouselItem.innerHTML = `
            <div class="news-card">
                <img class="news-card-image" onclick="" src=${news.enclosure.link} alt="${news.guid}">

                <div class="news-body">
                    <h5 class="card-title">${news.title}</h5>
                    <p class="card-author">${news.author} <span class="circle"></span> ${new Date(news.pubDate).toLocaleDateString()}</p>
                    <p class="card-text">${news.description.slice(0,100)}...
                    <a href="${news.link}" class="card-link" target="_blank">View Details</a>
                    </p>
                </div>
            </div>
            `;



            innerCarouselElem.appendChild(carouselItem);

        })

        AccordianParent.appendChild(newsAccordianElem);

    } catch (err) {
        console.log(err);
        console.log(new Error(`Failed to add news ${title}`));
    }
}


const addNewsToDOM = () => {
    try {

            NewsPortals.forEach((portal, index) => {
                addNewsFromLinkToDOM(portal.title, portal.link, index);
            })

    } catch (err) {
        console.log(new Error(err));
    }
}


addNewsToDOM();
