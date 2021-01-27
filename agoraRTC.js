let handleError = (err) => {
  console.log(err);
};

let addVideoStream = (streamID) => {
  console.log(streamID);
  let childContainer = document.getElementById("child-frames");
  let remoteContainer = document.createElement("div");
  let streamDiv = document.createElement("div");

  remoteContainer.className = "child";
  remoteContainer.id = "helo";
  streamDiv.id = streamID;
  streamDiv.style.transform = "rotateY(180deg)";
  remoteContainer.append(streamDiv);
  childContainer.appendChild(remoteContainer);

  let participantContainer = document.getElementById("left-pane-info");
  let newParticipant = document.createElement("div");
  newParticipant.className = "participant-name";
  newParticipant.innerHTML = streamID;
  participantContainer.appendChild(newParticipant);
};

document.getElementById("join").onclick = () => {
  let channelName = document.getElementById("channel").value;
  let userName = document.getElementById("username").value;
  let appID = "ab3f0e9065074402be67c1e1504af2b4";

  let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264",
  });

  client.init(appID, () => {
    console.log("AgoraRTC Client Connected"), handleError;
  });

  client.join(null, channelName, userName, () => {
    let localStream = AgoraRTC.createStream({
      video: true,
      audio: true,
    });

    localStream.init(() => {
      localStream.play("main-frame");
      console.log(`App id: ${appID}\nChannel id: ${channelName}`);
      client.publish(localStream);

      let participantContainer = document.getElementById("left-pane-info");
      let newParticipant = document.createElement("div");

      newParticipant.className = "participant-name";
      newParticipant.innerHTML = localStream.getId();
      participantContainer.appendChild(newParticipant);
    });
  });

  client.on("stream-added", (event) => {
    console.log("Added Stream");
    console.log(event);
    client.subscribe(event.stream, handleError);
  });

  client.on("stream-subscribed", (event) => {
    console.log("Subscribed Stream");
    let stream = event.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
  });
};
