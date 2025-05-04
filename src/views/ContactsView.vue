<template>
  <div class="contact-page bg-light text-dark">
    <div class="container py-5">
      <h1 class="text-center text-success mb-4">Контакты</h1>
      <p class="text-center lead">
        Если у вас есть какие-либо вопросы или проблемы, пожалуйста, свяжитесь с нами. Мы всегда готовы помочь.
      </p>

      <div class="row my-5">
        <div class="col-md-6">
          <h2 class="text-success">Контактная информация</h2>
          <p>
            <strong>Адрес:</strong> 123 Main St, Anytown, USA<br />
            <strong>Телефон:</strong> (123) 456-7890<br />
            <strong>Email:</strong> info@example.com
          </p>
        </div>
        <div class="col-md-6">
          <h2 class="text-success">Форма обратной связи</h2>
          <form>
            <div class="mb-3">
              <label for="name" class="form-label">Имя</label>
              <input type="text" class="form-control" id="name" />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" />
            </div>
            <div class="mb-3">
              <label for="message" class="form-label">Сообщение</label>
              <textarea class="form-control" id="message" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-success">Отправить</button>
          </form>
        </div>
      </div>

      <div class="row my-5">
        <div class="col-md-6">
          <h2 class="text-success">Карта</h2>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835921347731!2d-122.41941578467531!3d37.77492967975826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580c68c346e3d%3A0x4ff2542b50144d91!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
        <div class="col-md-6">
          <h2 class="text-success">Социальные сети</h2>
          <ul class="list-unstyled">
            <li>
              <a href="#" class="text-success">Facebook</a>
            </li>
            <li>
              <a href="#" class="text-success">Twitter</a>
            </li>
            <li>
              <a href="#" class="text-success">Instagram</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactPage",
};
</script>

<style scoped>
.contact-page {
  background-color: #e9f5e9;
}
</style>


