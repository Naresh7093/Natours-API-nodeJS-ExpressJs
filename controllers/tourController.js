const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
//route handlers

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};
//!get Tour by Id
exports.getTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);
  if (id > tours.length) {
    //   if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
//*create a tour
exports.createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  //   res.send('Done');
};
//!update a Tour
exports.updateTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tourIndex = tours.findIndex((tour) => tour.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  const updatedTour = { ...tours[tourIndex], ...req.body };
  tours[tourIndex] = updatedTour;
  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
};
// Delete A Tour
exports.deleteTour = (req, res) => {
  const id = parseInt(req.params.id, 10);

  // Validate the ID
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid tour ID',
    });
  }

  // Find the index of the tour with the given ID
  const tourIndex = tours.findIndex((tour) => tour.id === id);

  // If the tour doesn't exist, return a 404 error
  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  // Remove the tour from the array
  tours.splice(tourIndex, 1);

  // Return a success response
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
