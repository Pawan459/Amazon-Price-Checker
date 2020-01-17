/* 
All the keys are kept private and one is adviced to use their own credentials

URL: first Argument
Price: user desired price
yourMail : user's mail address on which you will be notified

*/

require('dotenv').config()

// Setting api key of our service
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })

// while running you have to give url as first argument, price as second argument 
// and email as third argument
const args = process.argv.slice(2)
const url = args[0]
const price = args[1]
const userEmail = args[2]


// asynchronous function to scrap the details out of the given AMAZON URL
checkPrice = async () =>{
    try {
        const priceString = await nightmare
          .goto(url)
          .wait("#priceblock_ourprice")
          .evaluate(
            () => document.getElementById("priceblock_ourprice").innerText
          )
          .end();
        
        // console.log('Price Detected Succesfully '+priceString)

        const priceNumber = parseFloat(priceString.replace("$", ""))
        
        if (priceNumber <= price) {
            await sendEmail(
                'Price is low',
                `The Price on ${url} has dropped below ${price}`
            )
        //   console.log("It is cheap")
        } else {
        //   console.log("It is expensive")
        }
    } catch (error) {
        await sendEmail(
            'The Amazon Price Checker Ended With an error',
            error.message
        )
        // console.log('Exception Occured')
        // console.log(error)
    }
}

// Function to send mails
sendEmail = (subject, body) =>{
    const email = {
      to: userEmail,
      from: "kuchbhi@gmail.com",
      subject: subject,
      text: body,
      html: body
    };
    return sgMail.send(email)
}

checkPrice()
