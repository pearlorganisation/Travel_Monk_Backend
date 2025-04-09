export const paginateWithAggregation = async (
  model,
  page = 1,
  limit = 10,
  lookupStages = [], // array of $lookup and $unwind stages
  matchStage = {}, // optional match filter
  sortStage = { createdAt: -1 }, // sorting stage
  projectStage = {} // optional projection
) => {
  const skip = (page - 1) * limit;

  const pipeline = [];

  pipeline.push(...lookupStages);

  console.log("keys : ", Object.keys(matchStage));
  if (matchStage && Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  if (Object.keys(sortStage).length) {
    pipeline.push({ $sort: sortStage });
  }

  if (Object.keys(projectStage).length) {
    pipeline.push({ $project: projectStage });
  }
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: skip }, { $limit: limit }],
    },
  });

//   console.log("pipeline: ", pipeline);
  const result = await model.aggregate(pipeline); // [{metadata: [{total: 4}], data: []}]
  const metadata = result[0]?.metadata[0] || {};
  const totalDocuments = metadata.total || 0;

  const totalPages = Math.ceil(totalDocuments / limit);

  let pagesArray = [1]; // make it separate utily later like as r2m

  if (totalPages > 3) {
    if (page > 2) pagesArray.push(page - 1);
    pagesArray.push(page);
    if (page < totalPages - 1) pagesArray.push(page + 1);
    if (!pagesArray.includes(totalPages)) pagesArray.push(totalPages);
  } else {
    for (let i = 2; i <= totalPages; i++) {
      pagesArray.push(i);
    }
  }

  pagesArray = [...new Set(pagesArray)].sort((a, b) => a - b);

  // Build pagination object
  const pagination = {
    total: totalDocuments,
    current_page: page,
    limit,
    next: page < totalPages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    pages: pagesArray,
  };

  return {
    data: result[0].data,
    pagination,
  };
};
