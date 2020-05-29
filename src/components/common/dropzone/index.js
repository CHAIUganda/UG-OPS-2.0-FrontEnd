import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import * as DropzoneLib from 'dropzone';

const DropzoneComponent = () => {
  const dropzoneNode = React.createRef();
  // eslint-disable-next-line no-unused-vars
  let dropzone;
  const filesArray = [];

  // eslint-disable-next-line no-unused-vars
  const onFileError = (file, message) => {
    console.log(`${file.name} :: message`);
  };

  const onAddFile = (file) => {
    filesArray.push(file);
  };

  const onRemoveFile = (file) => {
    const indexOfFile = filesArray.indexOf(file);
    filesArray.splice(indexOfFile, 1);
  };

  const setupDropzone = () => {
    const dropzoneArea = new DropzoneLib('div#d', {
      url: '/not/required/',
      dictDefaultMessage: 'Drop files or click to upload',
      uploadMultiple: true,
      autoProcessQueue: false,
      addRemoveLinks: true,
      createImageThumbnails: true,
    });

    dropzoneArea.on('error', (file, message) => console.log(message));

    dropzoneArea.on('addedfile', onAddFile);

    dropzoneArea.on('removedfile', onRemoveFile);

    return dropzoneArea;
  };

  useEffect(() => {
    dropzone = setupDropzone();
    return function destroyDropZone() {
      dropzone.destroy();
    };
  }, []);

  return (
    <div ref={dropzoneNode} id='d' className='dropzone'></div>
  );
};

DropzoneComponent.propTypes = {

};

export default DropzoneComponent;
