register("command", sendMessage()).setName("baltraz")
function sendMessage() {

  const image = new Image(`test.png`, `https://cdn.discordapp.com/attachments/968043926877503492/968269669398089728/auctionLore.png`)
  const myMessage = new Message(
    new TextComponent(`Test Name - Test Price`).setClick("run_command", `/sbmenu`)
    //Render Image
    new TextComponent("Picture").setHoverValue(image.draw(250, 250))
  );
  ChatLib.chat(sendMessage);
}
