document.addEventListener('DOMContentLoaded', function (event) {
  var form = document.querySelector('#authorize-form')

  form.addEventListener('submit', function (e) {
    e.preventDefault()

    console.log('custom form submit')

    var headers = new Headers({
      'Authorization': 'Bearer token'
    })

    var init = {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      cache: 'default'
    }
    
    // query params for post request
    var clientId = '507f1f77bcf86cd799439011'
    var state = Math.floor(Math.random() * 100000)
    var redirectUri = 'localhost:3000'

    var url = `/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`

    var request = new Request(url, init)

    fetch(request)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (err) {
        console.error(err)
      })
  })
})
