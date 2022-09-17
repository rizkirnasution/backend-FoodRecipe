const selectedColumnUserRecipes = {
  id: 'recipes.id',
  title: 'recipes.title',
  ingredient: 'recipes.ingredient',
  category: 'recipes.category',
  thumbnail: 'recipes.thumbnail',
  recipe_creator_id: 'recipes.creator_id',
  video_id: 'videos.id',
  video_title: 'videos.title',
  video_thumbnail: 'videos.thumbnail',
  video_url: 'videos.url',
  video_created_at: 'videos.created_at',
  video_updated_at: 'videos.updated_at',
  recipe_video_id: 'videos.recipe_id',
  creator_id: 'users.id',
  creator_email: 'users.email',
  creator_name: 'users.name',
  creator_picture: 'users.picture',
  created_at: 'recipes.created_at',
  updated_at: 'recipes.updated_at'
}

module.exports = { selectedColumnUserRecipes }
