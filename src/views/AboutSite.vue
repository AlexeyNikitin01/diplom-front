<template>
    <div class="about-page bg-light text-dark">
        <div class="container py-5">
            <h1 class="text-center text-success mb-4">О курсах материаловедения, авиации и моделях самолетов</h1>
            <p class="text-center lead">
                Добро пожаловать в авиационный институт МАИ! Здесь мы предлагаем курсы, которые объединяют материалы,
                инженерное творчество и авиационную индустрию.
            </p>

            <div class="row my-5">
                <div class="col-md-4 d-flex">
                    <div class="card border-success shadow h-100">
                        <img src="https://avatars.mds.yandex.net/i?id=679720f2a94327342bb6a0e160ce7bb8_l-8497208-images-thumbs&n=13"
                            class="card-img-top" alt="Материаловедение" />
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-success">Курсы материаловедения</h5>
                            <p class="card-text flex-grow-1">
                                Изучите свойства материалов, используемых в авиации, чтобы
                                понять, как они влияют на конструкцию и надежность.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 d-flex">
                    <div class="card border-success shadow h-100">
                        <img src="https://avatars.mds.yandex.net/i?id=679720f2a94327342bb6a0e160ce7bb8_l-8497208-images-thumbs&n=13"
                            class="card-img-top" alt="Авиация" />
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-success">Курсы по авиации</h5>
                            <p class="card-text flex-grow-1">
                                Узнайте об основах полетов, конструкциях самолетов и современных
                                авиационных технологиях.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 d-flex">
                    <div class="card border-success shadow h-100">
                        <img src="https://avatars.mds.yandex.net/i?id=679720f2a94327342bb6a0e160ce7bb8_l-8497208-images-thumbs&n=13"
                            class="card-img-top" alt="Модели самолетов" />
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-success">Модели самолетов</h5>
                            <p class="card-text flex-grow-1">
                                Создайте свои собственные модели самолетов и научитесь
                                основам аэродинамики.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="imageCarousel" class="carousel slide shadow" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="https://avatars.mds.yandex.net/i?id=679720f2a94327342bb6a0e160ce7bb8_l-8497208-images-thumbs&n=13" class="d-block w-100" alt="Image 1" />
                    </div>
                    <div class="carousel-item">
                        <img src="https://avatars.mds.yandex.net/i?id=679720f2a94327342bb6a0e160ce7bb8_l-8497208-images-thumbs&n=13" class="d-block w-100" alt="Image 2" />
                    </div>
                    <div class="carousel-item">
                        <img src="https://avatars.mds.yandex.net/i?id=679720f2a94327342bb6a0e160ce7bb8_l-8497208-images-thumbs&n=13" class="d-block w-100" alt="Image 3" />
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AboutPage",
};
</script>

<style scoped>
.about-page {
    background-color: #e9f5e9;
}

.card:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease-in-out;
}
</style>
