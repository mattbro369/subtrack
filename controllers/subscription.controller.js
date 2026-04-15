import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
	try {
		const subscription = await Subscription.create({
			...req.body,
			user: req.user._id,
		});

		const workflowId = await workflowClient.trigger({
			url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
			body: { subscriptionId: subscription._id.toString() },
			headers: {
				"content-type": "application/json",
			},
			retries: 0,
		});

		res.status(201).json({
			success: true,
			data: subscription,
		});
	} catch (error) {
		next(error);
	}
};

export const getSubscriptions = async (req, res, next) => {
	try {
		const subscriptions = await Subscription.find();
		res.status(200).json({
			success: true,
			message: "All subscriptions retrieved successfully",
			data: subscriptions,
		});
	} catch (error) {
		next(error);
	}
};

export const getUserSubscriptions = async (req, res, next) => {
	try {
		if (req.user._id.toString() !== req.params.id) {
			const error = new Error("You are not the owner of this account");
			error.status = 401;
			throw error;
		}

		const subscriptions = await Subscription.find({ user: req.params.id });

		res.status(200).json({ success: true, data: subscriptions });
	} catch (error) {
		next(error);
	}
};

export const getSubscriptionDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const userid = req.user.id;

		const subscription = await Subscription.findOne({
			_id: id,
			user: userid,
		});

		if (!subscription) {
			return res.status(404).json({
				success: false,
				message: "Subscription not found",
			});
		}

		res.status(200).json({
			success: true,
			data: subscription,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
