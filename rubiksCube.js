import * as THREE from "three";
import { Matrix4, Object3D } from "three";

const colorsEnum = ["WHITE", "RED", "BLUE", "ORANGE", "GREEN", "YELLOW"];

const sideLength = 10;

function createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
    let shape = new THREE.Shape();
    let eps = 0.00001;
    let radius = radius0 - eps;
    shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
    shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
    shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
    shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
    let geometry = new THREE.ExtrudeBufferGeometry( shape, {
      amount: depth - radius0 * 2,
      bevelEnabled: true,
      bevelSegments: smoothness * 2,
      steps: 1,
      bevelSize: radius,
      bevelThickness: radius0,
      curveSegments: smoothness
    });
    
    geometry.center();
    
    return geometry;
}


class Cubit extends THREE.Mesh {
    static cubitMaterial = new THREE.MeshPhongMaterial( {color: 0x000000} );
    static cubitGeometry = createBoxWithRoundedEdges(sideLength,sideLength,sideLength,sideLength/20,3);

    constructor(x, y, z) {
        super(Cubit.cubitGeometry,Cubit.cubitMaterial);
        this.position.x = x * sideLength;
        this.position.y = y * sideLength;
        this.position.z = z * sideLength;

        // Add stickers
        if (x < 0)
            this.add(Sticker.getStickerMesh(1));
        if (x > 0) 
            this.add(Sticker.getStickerMesh(3));
        if (y < 0)
            this.add(Sticker.getStickerMesh(0));
        if (y > 0)
            this.add(Sticker.getStickerMesh(5));
        if (z < 0)
            this.add(Sticker.getStickerMesh(2));
        if (z > 0) 
            this.add(Sticker.getStickerMesh(4));
    }

    turnX = (dir) => {
        const newY = -dir*this.position.z;
        const newZ = dir*this.position.y;
        this.position.set(this.position.x, newY, newZ);
        this.rotateOnWorldAxis(new THREE.Vector3(1,0,0), dir*Math.PI/2);
    }

    turnY = (dir) => {
        const newX = dir*this.position.z;
        const newZ = -dir*this.position.x;
        this.position.set(newX, this.position.y, newZ);
        this.rotateOnWorldAxis(new THREE.Vector3(0,1,0), dir*Math.PI/2)
    }

    turnZ = (dir) => {
        const newX = -dir*this.position.y;
        const newY = dir*this.position.x;
        this.position.set(newX, newY, this.position.z)
        this.rotateOnWorldAxis(new THREE.Vector3(0,0,1), dir*Math.PI/2)
    }

}

class Sticker {

    static stickerGeometry = new THREE.BoxGeometry(sideLength-1,sideLength-1,0.1);
    static stickerMaterials = [
        new THREE.MeshPhongMaterial( {color: 0xFFFFFF} ),
        new THREE.MeshPhongMaterial( {color: 0xB90000} ),
        new THREE.MeshPhongMaterial( {color: 0x0045AD} ),
        new THREE.MeshPhongMaterial( {color: 0xFF5900} ),
        new THREE.MeshPhongMaterial( {color: 0x009B48} ),
        new THREE.MeshPhongMaterial( {color: 0xFFD500} ),
    ]

    static getStickerMesh = (index) => {

        let sticker = new THREE.Mesh(Sticker.stickerGeometry, Sticker.stickerMaterials[index]);
        switch (index)
        {
        case 0:
            sticker.position.set(0,-1*sideLength/2,0);
            sticker.rotateX(Math.PI/2);
            break;
        case 1:
            sticker.position.set(-1*sideLength/2,0,0);
            sticker.rotateY(Math.PI/2);
            break;
        case 2:
            sticker.position.set(0,0,-1*sideLength/2);
            break;
        case 3:
            sticker.position.set(1*sideLength/2,0,0);
            sticker.rotateY(Math.PI/2);
            break;
        case 4:
            sticker.position.set(0,0,1*sideLength/2);
            break;
        case 5:
            sticker.position.set(0,1*sideLength/2,0);
            sticker.rotateX(Math.PI/2);
            break;
        }
        return sticker;
    }
}

export class RubiksCube extends THREE.Object3D {
    constructor() {
        super();
        this.cubits = [];
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++)
                for (let k = -1; k <= 1; k++) {
                    let cubit = new Cubit(i,j,k);
                    this.add(cubit);
                    this.cubits.push(cubit);
                }

        this.colors = [];
        this.stickerMeshes = [];
        for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            let face = []
            for (let i = -1; i <= 1; i++) {
                let row = []
                for (let j = -1; j <= 1; j++) {
                    row.push(colorsEnum[faceIndex]);
                }
                face.push(row);
            }
            this.colors.push(face);
        }
    }

    turnX(slice, direction) {
        for (let qb of this.cubits)
        {
            if (slice === -1 && qb.position.x < 0)
                qb.turnX(direction);
            if (slice === 1 && qb.position.x > 0)
                qb.turnX(direction);
        }
    }

    turnY(slice, direction) {
        for (let qb of this.cubits)
        {
            if (slice === -1 && qb.position.y < 0)
                qb.turnY(direction);
            if (slice === 1 && qb.position.y > 0)
                qb.turnY(direction);
        }
    }

    turnZ(slice, direction) {
        for (let qb of this.cubits)
        {
            if (slice === -1 && qb.position.z < 0)
                qb.turnZ(direction);
            if (slice === 1 && qb.position.z > 0)
                qb.turnZ(direction);
        }
    }

    print() {
        console.log(this.colors);
    }

    mesh() {
        return this.cube;
    }
}
