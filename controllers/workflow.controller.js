import dayjs from "dayjs";
import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";

const require = createRequire(import.meta.url);

const { serve } = require("@upstash/workflow/express");

const REMINDERS = {
	"7_days_before": 7,
	"5_days_before": 5,
	"3_days_before": 3,
	"1_day_before": 1,
	on_renewal_date: 0,
};

export const sendReminders = serve(async (context) => {
	const { subscriptionId } = context.requestPayload;

	const fetchSubscription = async (context, subscriptionId) => {
		return await context.run("Get Subscription", () => {
			return Subscription.findById(subscriptionId).populate(
				"user",
				"name email",
			);
		});
	};

	const sleepUntilReminder = async (context, label, date) => {
		console.log(`Sleeping until ${label} reminder on ${date}`);
		await context.sleepUntil(date.toDate());
	};

	const triggerReminder = async (context, label) => {
		return await context.run(`Trigger ${label} Reminder`);
		// Send email, sms etc
	};

	const subscription = await fetchSubscription(context, subscriptionId);

	if (!subscription || subscription.status !== "active") return;

	const renewalDate = dayjs(subscription.renewalDate);

	if (renewalDate.isBefore(dayjs())) {
		console.log(
			`Renewal date for subscription ${subscriptionId} has passed. No reminder email sent.`,
		);
		return;
	}

	for (const [reminderKey, daysBefore] of Object.entries(REMINDERS)) {
		const reminderDate = renewalDate.subtract(daysBefore, "day");

		if (reminderDate.isAfter(dayjs())) {
			await sleepUntilReminder(
				context,
				`Reminder ${daysBefore} days before`,
				reminderDate,
			);
		}

		await triggerReminder(context, `Reminder ${daysBefore} days before`);
	}
});
