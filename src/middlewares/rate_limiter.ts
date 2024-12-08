import { HttpStatusCodes } from "../types/enums/http";
import { rateLimit } from "express-rate-limit";

function limitPublicEndpointUse() {
    const PUBLIC_ENDPOINT_WINDOW_MINUTES = 15;
    return rateLimit({
        windowMs: PUBLIC_ENDPOINT_WINDOW_MINUTES * 60 * 1000,
        limit: 15,
        standardHeaders: "draft-7", 
        legacyHeaders: true,
        message: JSON.stringify({
            error: true,
            statusCode: HttpStatusCodes.TOO_MANY_REQUESTS,
            details: `Too many request, try again after ${PUBLIC_ENDPOINT_WINDOW_MINUTES} minutes.`
        }) 
    });
}

export default limitPublicEndpointUse;