// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.status(200).json({ 
    status : 'Online',
    app_env: process.env.APP_ENV || "LOCAL"
  })
}
