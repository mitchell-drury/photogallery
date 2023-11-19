import { useState, useEffect } from 'react';
import './index.css';

export default function App() {
  const regex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
  const [imagePaths, setImagePaths] = useState([]);
  const [searchString, setSearchString] = useState('');

  //get any images that already exist on the server
  useEffect(async () => {
    fetch('http://localhost:3000/images')
        .then(res => {
            return res.json();
        })
        .then(res => {
            let images = res.filter(img => {
                return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(img) === true
            }).map(img => {
                let indexOf = img.lastIndexOf('/');
                let trimIndex = indexOf < 0 ? 0 : indexOf + 1;
                return img.slice(trimIndex);
            });
            setImagePaths(images);
        })
  }, []);

  //just calls a click on the invisible file input
  function handleUploadClick() {
    document.getElementById('file').click();
  }
  function handleFileUpload(e) {
    if (regex.test(e.target.value)) {
      const formData = new FormData();
      [...e.target.files].forEach(file => {
        formData.append('file', file);
      })
      fetch('http://localhost:3000/upload', {
        'method': 'POST',
        'body': formData
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            //if upload was success, then update state to include in gallery
            setImagePaths([...imagePaths, res[0].filename]);
        })
    }
  }

  function handleSearch(e) {
    setSearchString(e.target.value.toLowerCase());
  }

  function handleDelete(img) {
    fetch('http://localhost:3000/delete', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({'filename': img})
    })
    .then(res => {
        if (res.status === 200) {
            let newImagePaths = [...imagePaths];
            let index = newImagePaths.indexOf(img.img);
            if (index > -1) {
                newImagePaths.splice(index, 1);
                setImagePaths(newImagePaths);
            }
        };
    })
  }

  const photoGrid = imagePaths.filter(img => {
    return img.toLowerCase().indexOf(searchString.trim()) > -1;
    }).map((img, index) => {
      //chose to render images as background of div cus it handles resizing pretty easily
      return <div className="photoFrame" key={img}>
                <div className="photo" style={{backgroundImage: `url(${encodeURIComponent(img)})` }}> </div>
                <div className="caption">
                    <span>{img} </span>
                    <span className="delete" onClick={() => handleDelete({img})}> Delete </span>
                </div>
            </div>
  });

  const plural = photoGrid.length !== 1 ? 's' : '';
  const imageCount = photoGrid.length + ' image' + plural;

  return (
    //had to 'fake' a click on the hidden file input in order to use button -> so as to customize action text
    <div className="App">
      <div id="title">
        <h1>Gallery</h1>
      </div>
      <div id="tool-bar">
        <input id="search" type="text" placeholder="search" onChange={handleSearch} />
        <button id="upload" onClick={handleUploadClick}> Upload </button>
        <input id="file" type="file" name="file" placeholder="Upload" multiple onChange={handleFileUpload} />
      </div>
      <div>
        {imageCount}
      </div>
      <div id="photoGrid">
        {photoGrid}
      </div>
    </div>
  );
}