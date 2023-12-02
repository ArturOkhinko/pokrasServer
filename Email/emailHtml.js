module.exports = (link) => {
  return `<div style="display: flex; flex-direction: column; align-items: center">
  <div
    style="
      background: linear-gradient(45deg, rgb(26, 92, 113), rgb(0, 238, 255));
      border-radius: 10px;
    "
  >
    <p style="margin: 10px">
      <a href="${link}" style="color: rgb(255, 255, 255)"
        >Активировать аккаунт</a
      >
    </p>
  </div>

  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      border: 1px solid transparent;
      border-image: linear-gradient(45deg, rgb(26, 92, 113), rgb(0, 238, 255));
      border-image-slice: 1;
      border-radius: 10px;
      max-width: calc(100% - 20px);
      margin: 10px;
    "
  >
    <i style="align-self: flex-start; margin: 10px"
      >Контакты для связи с нами</i
    >
    <div style="margin: 10px">Номер телефона: 8 (987) 444 07 63</div>
    <div
      style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin: 10px;
        max-width: calc(100% - 20px);
      "
    >
      <a
        href="https://vk.com/pokrasgrad"
        style="
          background: linear-gradient(
            45deg,
            rgb(255, 242, 0),
            rgb(0, 238, 255)
          );
          color: rgb(26, 92, 113);
          border-radius: 10px;
          margin: 10px;
          width: 100px;
          display: flex;
          justify-content: center;
        "
      >
        <p>VK</p>
      </a>

      <a
        href="https://wa.me/79874440763"
        style="
          background: linear-gradient(
            45deg,
            rgb(255, 242, 0),
            rgb(0, 238, 255)
          );
          color: rgb(26, 92, 113);
          border-radius: 10px;
          margin: 10px;
          width: 100px;
          display: flex;
          justify-content: center;
        "
      >
        <p>WhatsApp</p>
      </a>

      <a
        href="https://t.me/pokrasgrad"
        style="
          background: linear-gradient(
            45deg,
            rgb(255, 242, 0),
            rgb(0, 238, 255)
          );
          color: rgb(26, 92, 113);
          border-radius: 10px;
          margin: 10px;
          width: 100px;
          display: flex;
          justify-content: center;
        "
        ><p>Telegrame</p>
      </a>

      <a
        href="https://instagram.com/pokrasgrad?igshid=NTc4MTIwNjQ2YQ=="
        style="
          background: linear-gradient(
            45deg,
            rgb(255, 242, 0),
            rgb(0, 238, 255)
          );
          color: rgb(26, 92, 113);
          border-radius: 10px;
          margin: 10px;
          width: 100px;
          display: flex;
          justify-content: center;
        "
        ><p>Instagram</p>
      </a>
    </div>
  </div>
</div>`;
};
