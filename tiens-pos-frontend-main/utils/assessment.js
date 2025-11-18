export function assignGrade(finalMark, gradesArray, subjectName) {
  const gradeObj = gradesArray.find(grade => {
    const { from, to } = grade;
    /** @type any[] */
    const subjects = grade.subjects;
    const isSubject = subjects.find((subject) => {
      return subject.subject === subjectName;
    })
    if (isSubject) {
      return finalMark >= from && finalMark <= to;
    }
    return false;
  });
  return gradeObj ? gradeObj : "No Grade Found";
}

export function assessSubjects(data) {
  const groupedData = data.reduce((result, entry) => {
    const { subject, examType, finalMark, examPercent, points } = entry;

    if (!result[subject]) {
      result[subject] = {
        subject: subject,
        totalMark: 0,
        totalPercent: 0,
        markGrade: 0,
        totalPoints: 0,
        examTypes: [],
      };
    }

    if (examPercent > 0) {
      result[subject].totalMark += finalMark;
      result[subject].totalPercent += examPercent;
      result[subject].totalPoints += parseFloat(points);
    }

    const examTypeData = {
      type: examType,
      markPercent: `${finalMark}/${examPercent}`,
    };

    result[subject].examTypes.push(examTypeData);

    result[subject].markGrade =
      (result[subject].totalMark / result[subject].totalPercent) * 100;

    return result;
  }, {});

  return Object.values(groupedData);
}

export const findDivision = (points, divisions) => {
  return divisions.find((division, index, arr) => {
    const max = division.upperLimit;
    const min = division.lowerLimit;
    return points >= min && points <= max;
  });
}
