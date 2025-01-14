import Services from "../models/Services.models.js";
import { ApiError } from "../utils/ApiError.js";

export const singleServicesService = async (id) => {
  try {
    if (!id) {
      console.log("Invalid ID provided");
    } else {
      const services = await Services.findOne({
        where: { id },
      });
      if (!services) {
        throw new ApiError(404, "No services found");
      }
      return services;
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// Getting all services

export const allServicesService = async () => {
  try {
    const services = await Services.findAll();
    if (!services) {
      throw new ApiError(404, "No services found");
    }
    return services;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// Getting all active services

export const activeServicesService = async () => {
  try {
    const services = await Services.findAll({
      where: {
        status: true,
      },
    });
    if (!services) {
      throw new ApiError(404, "No services found");
    }
    return services;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const deleteServicesService = async (id) => {
  try {
    const services = await Services.findByPk(id);
    if (!services) {
      throw new ApiError(404, "services not found");
    }

    await services.destroy(); // Permanent delete (or use soft delete if configured)
    return services;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const changeStatusServicesService = async (id) => {
  try {
    const services = await Services.findByPk(id);

    if (!services) {
      throw new ApiError(404, "services not found");
    }

    services.status = !services.status;
    await services.save();

    return services;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

// Edit the services
export const editServicesService = async (params) => {
  try {
    const {id}=params;
    const {
      servicesName,
    } = params;
    const services = await Services.findByPk(id);

    if (!services) {
      throw new ApiError(404, "Services not found");
    }
    services.servicesName = servicesName || services.servicesName;
    await services.save();
    return services;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const addServicesService = async (
  servicesName,
  status,
  createdBy,
) => {
  try {
    if (!servicesName) {
      throw new ApiError(400, "Please put services name");
    }
    const services = await Services.create({
      servicesName,
      status,
      createdBy,
    });
    return services;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
