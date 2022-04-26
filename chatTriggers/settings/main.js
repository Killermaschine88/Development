import { @Vigilant, @TextProperty, @ColorProperty, @ButtonProperty, @SwitchProperty, Color } from 'Vigilance';

@Vigilant("MyModuleName")
class Settings {
    @TextProperty({
        name: "text",
        description: "Example of text input that does not wrap the text",
        category: "General",
        subcategory: "Category",
        placeholder: "Empty... :("
    })
    textInput = "";

    @ButtonProperty({
        name: "Do action!!!",
        description: "print some cool stuff :)",
        category: "General",
        subcategory: "Category",
        placeholder: "Activate"
    })
    myButtonAction() {
        console.log("wow i have a button?!?");
    }

    constructor() {
        this.initialize(this);
        this.registerListener("text", newText => {
            console.log(`Text changed to ${newText}`);
        });
        this.setCategoryDescription("General", "shows... cool stuff :)")
        this.setSubcategoryDescription("General", "Category", "Shows off some nifty property examples.")
    }
}

export default new Settings();