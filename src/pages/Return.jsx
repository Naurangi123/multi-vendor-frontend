import React, { useState } from "react";

export default function Return() {
  const [visible, setVisible] = useState('privacy');

  const handleclick = (policy) => {
    setVisible(visible === policy ? '' : policy)

  }
  return (
    <>
      <div className="container">
        <ul class=" max-w-4xl mx-auto px-4 py-8 flex text-2xl justify-center gap-20  ">
          <li>
            <a href="#privacy-policy" onClick={() => { handleclick('privacy') }}
              class="block hover:text-blue-600 focus:outline-none  focus:ring-opacity-50">Privacy Policy</a>
          </li>
          <li>
            <a href="#refund-policy"
              onClick={() => { handleclick('refund') }}
              class="block hover:text-blue-600 focus:outline-none  focus:ring-opacity-50">Refund Policy</a>
          </li>
          <li>
            <a href="#shipping-policy"
              onClick={() => { handleclick('shipping') }}
              class="block hover:text-blue-600 focus:outline-none  focus:ring-opacity-50">Shipping Policy</a>
          </li>
        </ul>
        {visible === 'privacy' && <div class=" pravacyPolicy max-w-4xl mx-auto px-4 py-8">
          <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">
            Privacy Policy
          </h1>

          <section class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800">
              Information We Collect
            </h2>
            <p class="text-gray-700">
              <strong>acstechconsulting.com</strong> is a property of ASV
              Consulting Services Pvt Ltd, an Indian Company registered under
              the Companies Act, 2013.
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Contact information: name, email, mobile number, phone number,
                street, city, state, pin code, country, and IP address.
              </li>
              <li>
                Payment and billing information: billing name, billing address,
                and payment method. We never collect credit card details; these
                are processed by our payment partner Razorpay.
              </li>
              <li>
                Other information: IP address, browser type, referring site,
                pages accessed, and device information.
              </li>
            </ul>
          </section>

          <section class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800">
              How We Collect Information
            </h2>
            <p class="text-gray-700">We collect information in two ways:</p>
            <ul class="list-decimal pl-6 space-y-2 text-gray-700">
              <li>
                Directly from you: when you register on our website or make a
                purchase.
              </li>
              <li>
                Passively: through tracking tools like Google Analytics, browser
                cookies, and web beacons.
              </li>
            </ul>
          </section>

          <section class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800">
              Use of Your Personal Information
            </h2>
            <ul class="list-decimal pl-6 space-y-2 text-gray-700">
              <li>
                To contact you for order confirmations or promotional purposes.
              </li>
              <li>To respond to your inquiries or comments.</li>
              <li>
                To improve our products and services by customizing your
                experience.
              </li>
            </ul>
          </section>

          <section class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800">Email Opt-Out</h2>
            <p class="text-gray-700">
              You can opt out of receiving marketing emails by emailing{" "}
              <a href="mailto:info@acstechconsulting.com" class="text-blue-600">
                info@acstechconsulting.com
              </a>
              . Please note that it may take up to 5 days to process your
              request. Even if you opt out of marketing messages, we will
              continue to send transactional emails and SMS regarding your
              purchases.
            </p>
          </section>

          <section class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800">
              Third-Party Sites
            </h2>
            <p class="text-gray-700">
              Our website may contain links to third-party sites. This privacy
              policy does not apply to those sites. We encourage you to read the
              privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800">
              Grievance Officer
            </h2>
            <p class="text-gray-700">
              In accordance with the Information Technology Act 2000 and rules
              made thereunder, the name and contact details of the Grievance
              Officer are provided below:
            </p>
            <p class="text-gray-700">
              <strong>Mr. Vinay Kumar</strong>
              <br />
              Email:{" "}
              <a href="mailto:info@acstechconsulting.com" class="text-blue-600">
                info@acstechconsulting.com
              </a>
            </p>
          </section>
        </div>}

        {visible === 'refund' &&
          <div className="refoundPolicy  max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Refund Policy</h1>
            <p className="mb-4">
              Return Policy helps the customers to opt for the exchange of products, replacement and refund for the products which is offered by the sellers to customers. The products displayed on the website under different category may have different returns policy. Refer below the items on which the customer can refund/replace the products to the website dealers.
            </p>

            <p className="mb-4">
              <strong>Category:</strong> Clothes like Men’s lifestyles (Jeans, T-shirts, Formal and Casual Pants), Women’s lifestyles (Skirts, Trousers, Jeans), Sunglass, Belts, Bags, Suitcase, Raincoat.
              <span className="block mt-1 text-sm text-blue-600">14 days Refund, replacement or exchange for the clothes category.</span>
            </p>

            <p className="mb-4">
              <strong>Category:</strong> Jewellery like earrings, Bracelets, Necklace, Bangles and Rings.
              <span className="block mt-1 text-sm text-blue-600">10 days Refund, replacement or exchange for the Jewellery category.</span>
            </p>

            <p className="mb-4">
              <strong>Category:</strong> Electronics items like Data cable, Charger, Earphones, Headphones, Wireless Speaker, Bulb, Switch, Socket, Case Cover and Glass Screens of Mobiles.
              <span className="block mt-1 text-sm text-blue-600">7 days Refund, replacement or exchange for the Electronics category.</span>
            </p>

            <p className="mb-4">
              <strong>Category:</strong> Accessories like Toys (Remote controlled toys, Learning toys), Stationary (Pens, Diary notebooks, Calculators).
              <span className="block mt-1 text-sm text-blue-600">10 days Refund, replacement or exchange for the Accessories category.</span>
            </p>

            <p className="mb-4">
              <strong>Category:</strong> Shoes like Casual, Formal, Sports.
              <span className="block mt-1 text-sm text-blue-600">10 days Refund, replacement or exchange for the Shoes category.</span>
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Rules and Conditions to Return, Replace and Exchange the Products:</h2>

            <p className="mb-4">The refund will be given for the damaged products only and while accepting the order if you receive a different item then on the spot return for the order will be delivered from the store.</p>

            <p className="mb-4">The exchange of the items will be made when the item is not related to the order which you have placed on the website. Also, if you place the different order and you want to cancel the order then the minimum amount i.e. 20% of the amount will be debited and the rest amount will be refunded. If you do not want the 20% to be deducted, you will have to pay the delivery charges, which will depend on your location.</p>

            <p className="mb-4">If you place a COD order and deny paying in cash to the delivery person or want to switch to online payment, please communicate this directly with the delivery person.</p>

            <p className="mb-4">The contact person listed on the website may refuse to accept returns, replacements or exchanges if any of the above conditions are not met.</p>

            <p className="mb-4">Refunds will only be processed after the returned products are received and verified by the seller.</p>

            <p className="mb-4">
              For any product-related queries, please contact us at:
              <a href="mailto:info@acstechconsulting.com" className="text-blue-500 underline ml-1">info@acstechconsulting.com</a>
            </p>
          </div>}

        {visible === 'shipping' && <div className="shippingPolicy max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Shipping policy</h1>
          <p className="mb-4">The order will be shipped within minimum of 2 days and maximum of 5 days for the Cigarette Lighter and if the location is near to company, it will take only 1 day</p>
          <p className="mb-4">There are other accessories like Men's, Women's, Jewellery and Technology Products, these items will be delivered within maximum of 2-5 days and sometimes if the location is very near to company , then it will take only 1 day.</p>
          <p className="mb-4">There are locations which are outside our range, then order may take approx. 15 days to deliver the product.</p>
          <p className="mb-4">The shipping charges will be free if the company doesn't want to include the charges. Sometimes, the company may take the charges depending on the location.</p>

          <p className="mb-4">For international shipping, we will include the shipping charges depending on the location and it may take around 20- 30 days to deliver the products.</p>
          <p className="mb-4">For any query and assistance, you may contact on the email id: info@acstechconsulting.com</p>
        </div>}
      </div>
    </>
  );
}
