const dummy = (blogs) => {
    // ...
    return 1;
  }
  const totalLikes = (blogs) =>{
    var total = 0;
    for(var i = 0; i < blogs.length;i++){
        total += blogs[i].likes;
    }
    return total;
  }

  const favouriteBlog = (blogs) => {
    if (blogs.length === 0) return 0; // Return 0 for empty array

    return blogs.reduce((maxLikes, blog) => Math.max(maxLikes, blog.likes), 0);
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
  }