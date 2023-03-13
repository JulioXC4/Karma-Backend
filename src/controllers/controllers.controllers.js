
    const example1 =async(req, res) => {

      res.status(200).send("Route example 1")
        
    };

    const example2 =async(req, res) => {

      res.status(200).send("Route example 2")
        
    };

    module.exports = {
        example1,
        example2,
      };
