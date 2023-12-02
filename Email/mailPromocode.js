module.exports = (code) => {
  return `<div style="display: flex; flex-direction: column; align-items: center; margin: 10px;">
    <div style="width: 300px; height: 150px; background: linear-gradient(45deg, rgb(26, 92, 113), rgb(0, 238, 255)); font-size: 24px; border-radius: 10px;"><p style="margin: 10px; color: white; text-align: center;">${code}</p></div>
    <div style="margin: 10px">Скопируйте этот код и отправьте его <a href="https://vk.com/prioroff">сюда</a></div>
    </div>`;
};
