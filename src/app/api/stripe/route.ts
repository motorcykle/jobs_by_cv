import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { checkSubscription } from "@/lib/subscription";
import { stripe } from "@/lib/stripe";

const return_url = process.env.NEXT_BASE_URL + "/";

export async function GET(req: NextRequest, res: NextResponse) {
  const session: any = await getServerSession(authOptions);

  try {
    if (session) {
      const isSubbed = await checkSubscription();
      if (isSubbed) {
        // portal
        const stripePortal = await stripe.billingPortal.sessions.create({
          customer: isSubbed.stripeCustomerId,
          return_url,
        })

        return NextResponse.json({ url: stripePortal.url }, { status: 200 });

      } else {
        // create checkout
        const stripeCheckout = await stripe.checkout.sessions.create({
          success_url: return_url,
          cancel_url: return_url,
          payment_method_types: ["card"],
          mode: "subscription",
          billing_address_collection: "auto",
          customer_email: session.user?.email,
          line_items: [
            {
              price_data: {
                currency: "USD",
                product_data: {
                  name: "Premium",
                  description: "Unlimited job searches!",
                },
                unit_amount: 700,
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            userId: session.user.id,
          },
        });

        return NextResponse.json({ url: stripeCheckout.url }, { status: 200 });
      }
    } else {
      throw Error("user not logged in")
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
