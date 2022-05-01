import { @Vigilant, @SwitchProperty, @CheckboxProperty, @TextProperty } from "Vigilance";

//Pretty simple for now no? Remember to ignore errors shown in editor

@Vigilant('AhBot', "§eAH Bot")
class Settings {
    @SwitchProperty({
        name: "Enable tracking",
        description: "Start tracking Items and show notifications in your chat",
        category: "Main"
    })
    enable = false;

    @SwitchProperty({
        name: "High price Warning",
        description: "Prices above 20 million Coins will be marked §cRed",
        category: "Main"
    })
    priceWarn = true;

    //----------------------------------------------------------------

    @TextProperty({
        name: "Min price",
        description: "Items below that Value will not show up in chat",
        category: "Filter"
    })
    minPrice = ""

    @TextProperty({
        name: "Max price",
        description: "Items above that Value will not show up in chat",
        category: "Filter"
    })
    maxPrice = ""

    constructor() {
        this.initialize(this);
    };
};

export default new Settings();