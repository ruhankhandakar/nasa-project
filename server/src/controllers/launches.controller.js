const {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
} = require('../models/launces.model');
const { getPagination } = require('../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);

  const launches = await getAllLaunches({ skip, limit });

  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      success: false,
      error: 'Missing required launch property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid launch date',
    });
  }

  const createdLaunch = await scheduleNewLaunch(launch);

  return res.status(201).json(createdLaunch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  const isExists = await existsLaunchWithId(launchId);
  if (!isExists) {
    return res.status(404).json({
      success: false,
      error: 'Launch not found',
    });
  }

  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      success: false,
      error: 'Launch not aborted',
    });
  }

  return res.status(200).json({
    success: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
