import db from "../connection";
import { images } from "../schema/images";

const seed_images = async () => {
    // PROTECTION: Prevent seeding in production
    const appStage = process.env.APP_STAGE;
    
    if (appStage === 'production') {
        console.error('ERROR: Cannot run seed script in production environment!');
        console.error('Current APP_STAGE:', appStage);
        process.exit(1); // Exit with error code
    }

    // confirmation for staging/test environments
    console.log(`Running seed in ${appStage} environment...`);
    console.log('starting seed...');

    try{

        console.log('deleting existing data...');
        await db.delete(images).execute();
        console.log('inserting seed data...');
        
        // Insert seed data
        // Insert pet_types (no ID needed)
        const insert_images = await db.insert(images).values([

            //
            {
                name: "User" ,
                url: "https://pixabay.com/get/g28588a34f7d34b10a28f0c8da1e24767e9a9769975c94c9b8b8972313c61a073a98fe5d29e766bcd6780021580ecff5a_640.png" 
            },
            {
                name: "Veterinarian 1" ,
                url: "https://pixabay.com/get/g646a86534081485eee607e2b122718cd74ca4e3c07c09dc3e870f7a2736171633508747d721ef34e036aa942071b8a88d0cdfaeb16f136dc33f58681ef4409f9_640.jpg" 
            },
            {
                name: "Veterinarian 2" ,
                url: "https://pixabay.com/get/g13dec46677226d2a564cc3dad879b5ada7d371c0604f263dd6d7598bf9b1626658c64bc8da6adb3b1004470ba3687145_640.jpg" 
            },
            {
                name: "Veterinary center" ,
                url: "https://pixabay.com/get/g58174e935c7e5c6d299e5b17ccf3ad3e29006508e51d6cac8075de7cdeebc4835668d7a5307bfa3963d5bc38097e4259c26745e6b1a20cf85fec96b2128f3add_640.jpg" 
            },
            {
                name: "Dog" ,
                url: "https://pixabay.com/get/g0f78d22308040ffeb0b2b59cc35784776ae4582f2269d5673d85b92c1b20695b742f7fe25f353c6b2fba1df3214eed36a0cd5cda405229207723a21caf007cf7_640.jpg"
            },
            //
            {   
                name: "Cat",
                url: "https://pixabay.com/get/g6cff5cc9fb7e9723bdf873e1e7ccc76870451a7879cb9d094af3d524e4087cd46b6ca0baae535dc848a5c67386f32e8abac0017554749c78a34332aa7d1a5e05_640.jpg"
            },
            //
            {
                name: "Freshwater fish",
                url: "https://pixabay.com/get/g80b3ab8b809cd65cbbe7c1284ad25c367af28756d7985bdda40ba5fdf2f57846e504d566538751e4c89a7e12b5f9ebeb_640.jpg"
            },
            //
            {
                name: "Budgie or Canarie", 
                url: "https://pixabay.com/get/g53297d3c9063d760585940e1c83ad0bbfbaf996b26fe7680155c85e5f11d78a9474dcb5a011922c1cb70b05b83fec15a5bdcec3991bf186a7f1e7b46e3e70394_640.jpg"
            },
            //
            {
                name: "Hamster",
                url: "https://pixabay.com/get/gf6644849fe307928599965c0219751b17c337e6e268af8429f4d51abdc46fb94f8eb2d77205258e07af29724bae8b27478363ae8f395d1af9b1d8a9740e33d1e_640.jpg"
            },
            //
            {
                name: "Rabbit",
                url: "https://pixabay.com/get/g89039c270522b0a5ffa0e42f9ada3ab76de8278b9752dcbf6a7dfdefb115a0d52a88285d0236580d1caec0795d9ab461364166f45e4ebc250c48e827c53917ce_640.jpg"
            },
            //
            {
                name: "Guinea pig",
                url: "https://pixabay.com/get/g6b47e65172ceb4cbe0346b47dd1a814bd4acac0dc35d21c3406c63269d9d4743ff6bb29cf53a949270d32f598845a93d45b82f187de242754a60f991a5a3bc1b_640.jpg"
            },
            //
            {
                name: "Water turtle",
                url: "https://pixabay.com/get/g651b16ea95739ef82452fc17bb1a92619fc2b6d2822ee5ba1c1b369346a1b12ae1a8f8d4c03fbda86c04dd0c905cfef597937d3b065683992b2f129d855462fc_640.jpg"
            },
            //
            {
                name: "Ferret", 
                url: "https://pixabay.com/get/g5f3131a6b3cb479f2fc6073e6e164ead86b908270c19c6030ebaa31b53ee4f1bd9f3c8c09cc0aadb8acbcf3109690d0db20554247eb2f29b5fbc483a2791839a_640.jpg"
            },
            //
            {
                name: "Gecko (small lizard)", 
                url: "https://pixabay.com/get/g91d160c732883a1ee1b8c1056d5d6bd40df2a4b0be7acd8edf1a4ab42afb41dfeebc55890a5308d1ff349c95c89d86246697dcdfd0f1fca275ac5729040f7e0f_640.jpg"
            },
            //
            {
                name: "Parrot or Cockatoo", 
                url: "https://pixabay.com/get/geddf271d35785ae606bbfdaa086326cc572578e53ced8b902830d8d4a143654e21a035c1da1cb809ed2055b2cfeba9c835f50151aa316975d4eaa6526b6db54e_640.jpg"
            },
            //
            {
                name: "Saltwater fish", 
                url: "https://pixabay.com/get/g25e03d3d8dce4f4fe5bcdc1255bac7ce34477e64386dd6a8c43e77d27908fea69d308379484ab7c1f16a093bc55b5d1b1f6944d75030f04080c098b59aad9bef_640.jpg"
            },
            //
            {
                name: "Snake", 
                url: "https://pixabay.com/get/gd0f2f33087b5296a90b2d88619f518e1e4051f1ce88aed5f097c9c0ab3204c384399142ff012575d525bdab257599fab79fa8b49e7eb9bb1ab3c436605eb07dd_640.jpg"
            },
            //
            {
                name: "Chinchilla", 
                url: "https://pixabay.com/get/gd96c181185e3388970722dc047e9a8ff464845fd206fe0dd7ca0979a15d0bca197afde9a4e605cfa2a19f1498797eb18_640.jpg"
            },
            //
            {
                name: "Pet rat",
                url: "https://pixabay.com/get/g2e365810b325b164101f624a9ae286009c82f8dce870ef08ce1691f6df09c73f72a8b6377b2de68f4c57bedc9acd1249_640.jpg"
            },
            //
            {
                name: "Gerbil",
                url: "https://pixabay.com/get/g6a908a7469c5e6a2e0eb435dbf02636a5ee0764e6f859de833e624d50bbee6eccfbe39f3c9f6f4f6a6e45001d87fc145_640.jpg"
            },
            //
            {
                name: "Hedgehog",
                url: "https://pixabay.com/get/g1ba84585cbce11e151da3ad0e7daab50ccbd60190bdf457d4f5c9eb65ec2b7a6a9628122af714e1b3bb6f54704e5721d34cd089439d58203ecbe7c6aa6beb299_640.jpg"
            },
            //
            {
                name: "Frogs (amphibians)",
                url: "https://pixabay.com/get/gb4053b49bebc8399ecd4043d76f3edc1cf82722a4cc0394764f905f05d6cc058e4dc1335d33e00c3328643c94d4249cf0be49d9e864e0058ccd7ee062c0472be_640.jpg"
            },
            //
            {
                name: "Tarantulas or Scorpions",
                url: "https://pixabay.com/get/g078b537c81bb13a7b537737ba132583338c38f8301913e91e228568abf3c4638f655720aeee81f01732a180f8ba83adb13e4c6fa50055cf2afae9aa67a498f0f_640.jpg"
            },
            //
            {
                name: "Pot-bellied pigs",
                url: "https://pixabay.com/get/g769a37c4e8b7873f98a15bfc692ab0a98981b801c8fd47e75692808977c9265093153a58776e1b3c29c1701c12ad50b5d49d5c57a6e9ece6a63ffc9cbda1af12_640.jpg"
            },
            //
            {
                name: "Other",
                url: "https://pixabay.com/get/g8b9d4e4d4e09e9c64bd458502590f7e321127f61abb8169cc787158793de09e682514160dc26ac594fc46fe83f954b5547e290783c9677162e76793385958ac0_640.png"
            }

        ]).returning();
        

        console.log('seed_images completed successfully!');

    }catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }

    if(require.main === module){
    seed_images().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}
}

export default seed_images;